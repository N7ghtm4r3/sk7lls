# Database passwords and TLS

Two rules for every connection to RDS PostgreSQL and every role password that an operator or a task sets.

## Send PostgreSQL only the SCRAM verifier

`ALTER ROLE … PASSWORD 'plaintext'` puts the password in the SQL text. PostgreSQL hashes it only after it arrives, so the plaintext reaches the server log when the statement fails (RDS default `log_min_error_statement = error`) or when someone turns on `log_statement`. Anyone who can read the RDS logs then has the role's password.

Send the SCRAM-SHA-256 verifier instead. PostgreSQL stores a string in the format `SCRAM-SHA-256$<iterations>:<salt>$<StoredKey>:<ServerKey>` as is, so the password never reaches the server and a log can show only the verifier.

- **Interactive:** psql `\password <role>` computes the verifier on the client. Use it for one-time operator steps.
- **Script or task:** compute the verifier with OpenSSL 3 (`openssl kdf`) and pass only that string to `ALTER ROLE`. Keep the plaintext in Secrets Manager only.

```sh
# The SCRAM-SHA-256 verifier of $1 (RFC 5802, 4096 iterations, 16-byte salt).
scram_verifier() {
  salt=$(openssl rand -base64 16)
  salt_hex=$(printf '%s' "$salt" | openssl base64 -d -A | od -An -v -tx1 | tr -d ' \n')
  salted=$(openssl kdf -keylen 32 -kdfopt digest:SHA256 -kdfopt "pass:$1" \
    -kdfopt "hexsalt:$salt_hex" -kdfopt iter:4096 PBKDF2 | tr -d ':')
  hmac() { printf '%s' "$1" | openssl dgst -sha256 -mac HMAC -macopt "hexkey:$salted" -binary; }
  stored=$(hmac 'Client Key' | openssl dgst -sha256 -binary | openssl base64 -A)
  server=$(hmac 'Server Key' | openssl base64 -A)
  printf 'SCRAM-SHA-256$4096:%s$%s:%s' "$salt" "$stored" "$server"
}

export DB_ROLE="$role" DB_VERIFIER="$(scram_verifier "$password")"
psql -X -q -v ON_ERROR_STOP=1 -d postgres <<'SQL'
\getenv role DB_ROLE
\getenv verifier DB_VERIFIER
SELECT format('ALTER ROLE %I WITH LOGIN PASSWORD %L', :'role', :'verifier') \gexec
SQL
```

Name the variable after its content (`DB_VERIFIER`), so no reader takes it for the password. Verify once against a local PostgreSQL with `log_statement=all`: the role logs in with the real password, a wrong password is refused, and the log never contains the plaintext.

## Verify the RDS certificate

Use `sslmode=verify-full` with the RDS CA bundle of the region. AWS recommends it: the connection is encrypted and the client checks the certificate and the hostname. `sslmode=no-verify` or `rejectUnauthorized: false` encrypts but accepts any server.

`sslmode=require` does not mean the same thing to every client. libpq (psql, pgAdmin, pg_dump) encrypts without verification. The Node driver `pg` reads it as full verification, and fails because Node does not trust the Amazon RDS CAs.

### Put the CA bundle in the image

Add the bundle in every image that connects to RDS, pinned by checksum:

```dockerfile
ADD --chmod=0644 --checksum=sha256:[bundle-sha256] \
  https://truststore.pki.rds.amazonaws.com/[region]/[region]-bundle.pem /usr/local/share/rds-ca.pem
# Node: pg and Node-based ORMs trust the bundle with no code.
ENV NODE_EXTRA_CA_CERTS=/usr/local/share/rds-ca.pem
# libpq tools: psql, pg_dump.
ENV PGSSLROOTCERT=/usr/local/share/rds-ca.pem
```

- **Regional bundle, not `global-bundle.pem`:** the global bundle changes each time AWS adds a region, so its pinned checksum would break the build. A regional bundle changes only when AWS rotates the CAs of that region. Then the build fails at the checksum line: download the bundle, check its certificates, and update the checksum in every Dockerfile that pins it.
- **Target an existing folder:** `ADD --chmod` also sets the mode of each folder it creates, so `0644` makes a new folder unreadable. `/etc/ssl` does not exist in the Node images; `/usr/local/share` exists in the Node and `postgres` images.
- **Check in the image:** run Node with the bundle once and confirm that it starts and loads the extra certificates.

### Set the mode per client

| Client | Setting |
|---|---|
| Node app | `DATABASE_URL` ends with `?sslmode=verify-full`; `NODE_EXTRA_CA_CERTS` from the image |
| psql or pg_dump task | `PGSSLMODE=verify-full` in the task definition; `PGSSLROOTCERT` from the image |
| pgAdmin on the admin node | `SSL mode: verify-full`, `Root certificate`: the downloaded regional bundle |
| Client through an SSM tunnel | The host is `localhost`, so `verify-full` fails on the hostname. Set the host to the RDS endpoint and the host address (`hostaddr`, pgAdmin `Parameters > Host address`) to `127.0.0.1`; otherwise use `verify-ca` with the root certificate |

A driver that does not use the Node trust store needs `sslrootcert=<bundle path>` in the URL.
