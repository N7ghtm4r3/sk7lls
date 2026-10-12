# Setup infrastruttura Pulumi con AWS

Questa procedura descrive la struttura base per inizializzare un progetto infrastrutturale con Pulumi, usando AWS come provider cloud, S3 come backend per lo stato e AWS KMS come secrets provider.

## Root

Crea una cartella dedicata all'infrastruttura:

```bash
mkdir infra
cd infra
```

Dentro `infra`, crea una cartella dedicata al provider cloud utilizzato:

```bash
mkdir aws
cd aws
```

> In alternativa ad `aws`, si puo creare una cartella con il nome del provider scelto.

## Prerequisiti

Prima di iniziare servono:

- Pulumi CLI installata
- AWS CLI installata
- credenziali AWS valide
- bucket S3 gia creato per salvare lo stato Pulumi
- chiave AWS KMS, o relativo alias, gia creata per cifrare i secrets

## Configurare AWS CLI

Configura le credenziali AWS:

```bash
aws configure
```

Il comando richiede:

- AWS Access Key ID
- AWS Secret Access Key
- Default region
- Default output format

## Login Pulumi su backend S3

Configura Pulumi per usare un backend S3 come storage dello stato:

```bash
pulumi login s3://[bucket-or-path]
```

Esempio:

```bash
pulumi login s3://my-pulumi-state-bucket
```

Questo passaggio va fatto prima di inizializzare il progetto, cosi lo stack viene creato direttamente sul backend corretto.

## Inizializzare il progetto Pulumi

Inizializza un nuovo progetto Pulumi con template AWS TypeScript:

```bash
pulumi new aws-typescript
```

Il comando crea il progetto Pulumi e inizializza uno stack.

## Configurare AWS KMS come secrets provider

Se lo stack e gia stato creato, puoi cambiare il secrets provider usando AWS KMS:

```bash
pulumi stack change-secrets-provider \
  "awskms://alias/[slug]?region=[region]"
```

Dove:

- `[slug]` e l'alias della chiave KMS
- `[region]` e la regione AWS, ad esempio `eu-west-1`

Esempio:

```bash
pulumi stack change-secrets-provider \
  "awskms://alias/my-project-key?region=eu-west-1"
```

## Configurare le config dello stack

Prima di configurare i secrets, imposta le configurazioni non sensibili dello stack.

Queste configurazioni vengono salvate nel file dello stack, ad esempio:

```text
Pulumi.staging.yaml
```

Se esiste un template di riferimento, copia prima dal template le config non sensibili nel file dello stack corretto.

Dal template vanno copiate solo configurazioni come:

- region
- domain
- DNS
- nomi risorse
- configurazioni applicative non segrete

I secrets non devono essere copiati manualmente dal template.

Dopo aver copiato le config dal template, verifica e imposta i DNS reali del progetto e dell'ambiente.

Formato generale:

```bash
pulumi config set [nome-config] "[valore]"
```

Esempio:

```bash
pulumi config set domain "avatar-poc.sandbox.devpunks.com"
pulumi config set aws:region "eu-central-1"
```

Questi valori possono anche essere controllati direttamente nel file `Pulumi.[stack].yaml`, ma e preferibile usare `pulumi config set` per mantenere il formato corretto.

### Configurazione immagine backend

Se il progetto prevede un backend containerizzato, puo esserci una config per scegliere se usare un'immagine sample o l'immagine reale dell'applicazione.

Per un primo bootstrap dell'infrastruttura, puoi usare temporaneamente un'immagine sample:

```bash
pulumi config set backend:useSampleImage true
pulumi up
```

Questa modalita e utile per verificare che VPC, cluster, load balancer, DNS e risorse base vengano creati correttamente senza dipendere dalla pipeline applicativa.

Se il progetto crea anche il repository ECR, questa modalita serve anche a rompere il ciclo di bootstrap:

```text
Pulumi deve creare ECR -> Docker deve pushare su ECR -> ECS deve usare l'immagine da ECR
```

Per questo il primo `pulumi up` puo usare una sample image. Dopo che ECR esiste, builda e pusha l'immagine reale.

Esempio:

```bash
ECR=$(pulumi stack output ecrRepositoryUrl)
TAG=$(git rev-parse --short HEAD)

aws ecr get-login-password --region [aws-region] \
  | docker login --username AWS --password-stdin "${ECR%/*}"

docker build -f [backend-dockerfile-path] -t "$ECR:$TAG" [docker-context]
docker push "$ECR:$TAG"
```

Solo dopo il push dell'immagine reale, imposta:

```bash
pulumi config set backend:useSampleImage false
pulumi config set commitHash "$TAG"
pulumi up
```

In questo caso devi anche passare il tag dell'immagine da deployare. Se usi un valore manuale:

```bash
pulumi config set commitHash "[tag-immagine]"
```

Il nome `commitHash` e una convenzione comune: spesso coincide con lo short hash del commit Git usato come tag dell'immagine Docker. In generale rappresenta la versione dell'applicazione da deployare.

Non impostare `backend:useSampleImage false` prima che l'immagine `"[ecr-repository-url]:[tag-immagine]"` esista davvero nel registry. In caso contrario ECS provera a scaricare un'immagine inesistente e il servizio fallira.

## Configurare i secrets dello stack

Dopo aver configurato le config non sensibili e il secrets provider corretto, i valori sensibili devono essere salvati nello stack usando `--secret`.

Formato generale:

```bash
pulumi config set --secret [nome-secret] "[valore]"
```

Esempio:

```bash
pulumi config set --secret databasePassword "my-password"
```

Per secret applicativi generabili, crea il valore al bootstrap e poi lascialo stabile. Ad esempio, un secret auth del backend puo essere generato cosi:

```bash
pulumi config set --secret backend:authSecret "$(openssl rand -base64 32)"
```

Non rigenerare secret di firma/sessione a ogni deploy: cambiarli puo invalidare sessioni o token gia emessi. Rigenerali solo quando crei lo stack, cambi secrets provider, recuperi da una perdita dei secret, o vuoi ruotarli intenzionalmente.

I secrets configurati in questo modo vengono cifrati usando il secrets provider dello stack, quindi in questo caso AWS KMS.

Per verificare la configurazione dello stack:

```bash
pulumi config
```

## Utilizzare il template della repo

Dopo aver completato la configurazione base di Pulumi, puoi usare il template della repo `aws-infra-template` come riferimento per strutturare il progetto infrastrutturale.

In particolare, dal template devi recuperare le cartelle:

- `components`
- `lib`

Queste cartelle vanno copiate dentro il progetto Pulumi appena inizializzato, sotto la cartella del provider.

Esempio con AWS:

```text
infra/
└── aws/
    ├── components/
    ├── lib/
    ├── index.ts
    ├── Pulumi.yaml
    └── Pulumi.staging.yaml
```

Il template va usato come passaggio successivo alla configurazione iniziale, non al posto di:

```bash
pulumi new aws-typescript
```

In questo modo il progetto Pulumi viene prima inizializzato correttamente, poi arricchito con la struttura condivisa presente nella repo template.

## Copiare le config dal template

Dopo aver copiato le cartelle `components` e `lib`, copia anche le configurazioni non sensibili dal template prima di impostare o modificare le config con `pulumi config set`.

Le config possono trovarsi nei file stack, ad esempio:

```text
Pulumi.staging.yaml
Pulumi.production.yaml
```

Dal template vanno copiate solo le configurazioni non sensibili, come:

- region
- domain
- DNS
- nomi risorse
- configurazioni applicative non segrete

I secrets non devono essere copiati manualmente dal template.

Dopo la copia, i DNS presenti nelle config devono essere sostituiti con i DNS reali del progetto e dell'ambiente.

I valori sensibili vanno reinseriti nello stack corretto usando:

```bash
pulumi config set --secret [nome-secret] "[valore]"
```

## Adattare l'entrypoint Pulumi

Dopo aver copiato cartelle e config dal template, aggiorna l'entrypoint del progetto Pulumi, solitamente:

```text
index.ts
```

Questo file deve usare davvero i componenti copiati dal template, ad esempio quelli presenti in:

```text
components/
lib/
```

Il file generato da `pulumi new aws-typescript` contiene solo un esempio base. Prima di eseguire un deploy, sostituisci o adatta quell'esempio con la composizione reale dell'infrastruttura del progetto.

In modo generico, `index.ts` dovrebbe:

- leggere le config dello stack
- istanziare i componenti infrastrutturali necessari
- collegare tra loro risorse, DNS, backend, frontend, database o altri servizi richiesti
- esportare gli output utili

Prima di applicare le modifiche su AWS, verifica sempre cosa verrebbe creato:

```bash
pulumi preview
```

Solo se il preview mostra le risorse attese, procedi con:

```bash
pulumi up
```

## Usare AWS Systems Manager per l'accesso amministrativo

Systems Manager permette di amministrare nodi gestiti senza esporre direttamente porte SSH o RDP. Un nodo gestito puo essere un'istanza EC2 Windows o Linux, una VM o un server registrato tramite l'attivazione ibrida di Systems Manager.

### Installare AWS Session Manager Plugin sul computer locale

Il comando `aws ssm start-session` richiede AWS CLI e AWS Session Manager Plugin sul computer dal quale viene aperto il tunnel. Il plugin e locale: non va installato sull'istanza EC2 usata come destinazione, dove deve invece essere attivo SSM Agent.

Verifica prima se il plugin e gia disponibile:

```bash
session-manager-plugin
```

Se il comando non esiste, installalo con la procedura adatta al sistema operativo.

#### macOS

Con Homebrew, sia su Apple Silicon sia su Intel:

```bash
brew install --cask session-manager-plugin
```

In alternativa usa l'installer firmato AWS. Su Apple Silicon:

```bash
curl "https://s3.amazonaws.com/session-manager-downloads/plugin/latest/mac_arm64/session-manager-plugin.pkg" \
  -o "session-manager-plugin.pkg"
sudo installer -pkg session-manager-plugin.pkg -target /
sudo ln -s /usr/local/sessionmanagerplugin/bin/session-manager-plugin \
  /usr/local/bin/session-manager-plugin
```

Su Mac Intel sostituisci `mac_arm64` con `mac` nell'URL.

Documentazione ufficiale: [Installare Session Manager Plugin su macOS](https://docs.aws.amazon.com/systems-manager/latest/userguide/install-plugin-macos-overview.html).

#### Windows

Apri PowerShell e scarica l'installer ufficiale:

```powershell
$installer = Join-Path $env:TEMP "SessionManagerPluginSetup.exe"
Invoke-WebRequest `
  "https://s3.amazonaws.com/session-manager-downloads/plugin/latest/windows/SessionManagerPluginSetup.exe" `
  -OutFile $installer
Start-Process $installer -Verb RunAs -Wait
```

L'installazione richiede privilegi di amministratore. Chiudi e riapri PowerShell dopo l'installazione. Se il comando non viene trovato, aggiungi al `PATH`:

```text
C:\Program Files\Amazon\SessionManagerPlugin\bin\
```

Documentazione ufficiale: [Installare Session Manager Plugin su Windows](https://docs.aws.amazon.com/systems-manager/latest/userguide/install-plugin-windows.html).

#### Ubuntu o Debian

Su sistemi `x86_64`:

```bash
curl "https://s3.amazonaws.com/session-manager-downloads/plugin/latest/ubuntu_64bit/session-manager-plugin.deb" \
  -o "session-manager-plugin.deb"
sudo dpkg -i session-manager-plugin.deb
```

Su sistemi `ARM64`, sostituisci `ubuntu_64bit` con `ubuntu_arm64` nell'URL.

Documentazione ufficiale: [Installare Session Manager Plugin su Ubuntu e Debian](https://docs.aws.amazon.com/systems-manager/latest/userguide/install-plugin-debian-and-ubuntu.html).

#### Amazon Linux o RHEL

Su Amazon Linux 2023 oppure RHEL 8 e 9 `x86_64`:

```bash
sudo dnf install -y \
  https://s3.amazonaws.com/session-manager-downloads/plugin/latest/linux_64bit/session-manager-plugin.rpm
```

Su Amazon Linux 2 oppure RHEL 7 usa `yum` al posto di `dnf`. Su sistemi `ARM64`, sostituisci `linux_64bit` con `linux_arm64` nell'URL.

Documentazione ufficiale: [Installare Session Manager Plugin su Amazon Linux e RHEL](https://docs.aws.amazon.com/systems-manager/latest/userguide/install-plugin-linux.html).

#### Verificare l'installazione

Su tutti i sistemi, apri un nuovo terminale ed esegui:

```bash
session-manager-plugin
```

Il comando deve confermare che il plugin e installato. Se `aws ssm start-session` restituisce `SessionManagerPlugin is not found`, il plugin manca oppure la sua directory non e presente nel `PATH`.

Documentazione ufficiale: [Verificare Session Manager Plugin](https://docs.aws.amazon.com/systems-manager/latest/userguide/install-plugin-verify.html).

### Impostare o cambiare la password di un utente locale

Le credenziali del sistema operativo sono distinte da:

- credenziali AWS usate dalla CLI o dall'instance role
- password del database conservate in Secrets Manager
- secrets applicativi configurati nello stack Pulumi

Accedi prima al nodo tramite Session Manager con un'identita autorizzata. Cambia una password locale solo quando serve realmente per RDP, console o un altro accesso del sistema operativo. Non inserire password permanenti in Pulumi, user data, repository, documentazione o comandi registrati nella cronologia.

#### Windows

Da una sessione PowerShell con privilegi amministrativi, scegli l'utente locale e inserisci la nuova password in modo interattivo:

```powershell
$UserName = "Administrator"; $Password = Read-Host "Nuova password Windows" -AsSecureString; Set-LocalUser -Name $UserName -Password $Password; Enable-LocalUser -Name $UserName
```

Per un utente diverso, cambia il valore di `$UserName`. Verifica lo stato senza mostrare la password:

```powershell
Get-LocalUser -Name $UserName
```

Per il login locale usa, ad esempio:

```text
Username: .\Administrator
Password: valore inserito nel prompt protetto
```

Evita comandi come `net user Administrator "password"`: funzionano, ma lasciano la password in chiaro nella cronologia PowerShell, nei log o nei dati della sessione SSM.

Se l'istanza Windows e stata avviata senza una key pair, il normale flusso EC2 `Get Windows password` non puo decrittare la password iniziale. Una sessione SSM amministrativa consente comunque di impostare una nuova password locale con il comando precedente.

#### Linux e altri sistemi Unix

Individua prima l'utente corretto senza assumere che sia `root`, `ec2-user` o `ubuntu`:

```bash
id [username]
```

Poi usa il prompt interattivo di sistema, che non inserisce la password nella riga di comando:

```bash
sudo passwd [username]
```

Su macOS il comando `passwd [username]` puo essere usato da un account con privilegi adeguati. Le policy locali del sistema operativo determinano complessita, scadenza e blocco dell'account.

Cambiare una password non abilita automaticamente l'accesso remoto. Per Windows preferisci Fleet Manager Remote Desktop o un tunnel SSM verso RDP; per Linux preferisci Session Manager o chiavi SSH. Non aprire `3389` o `22` a `0.0.0.0/0`.

## Accedere a un database privato tramite AWS Systems Manager

Se il database non ha un endpoint pubblico, usa un nodo amministrativo gestito da AWS Systems Manager. Non aprire PostgreSQL o RDP verso Internet solo per accedere al database.

Prima di configurare il client, identifica dove viene eseguito:

| Posizione del client database | Host | Porta | Tunnel locale |
|---|---|---|---|
| Computer esterno alla VPC | `localhost` | porta locale libera, ad esempio `55438` | necessario |
| Nodo amministrativo dentro la VPC | endpoint privato del database | porta reale del database, normalmente `5432` | non necessario |

La porta PostgreSQL remota resta normalmente `5432`. Una porta come `55438` e solo l'estremita locale scelta per un tunnel SSM; non sostituisce la porta del database. Se pgAdmin, DataGrip o un altro client gira gia sul nodo amministrativo e quel nodo puo raggiungere il database, usa direttamente endpoint e porta reali.

La procedura seguente presuppone che lo stack Pulumi esporti:

- ID dell'istanza amministrativa, ad esempio `dbAdminInstanceId`
- endpoint del database, ad esempio `dbEndpoint`
- ARN del secret del database, ad esempio `dbSecretArn`

Sostituisci i nomi degli output se il progetto usa nomi diversi. Dalla cartella del progetto Pulumi, seleziona esplicitamente lo stack e ricava tutti i valori senza inserirli manualmente:

```bash
PULUMI_STACK="[stack]"
AWS_REGION="$(pulumi config get aws:region --stack "$PULUMI_STACK")"
DB_ADMIN_INSTANCE_ID="$(pulumi stack output dbAdminInstanceId --stack "$PULUMI_STACK")"
DB_ENDPOINT="$(pulumi stack output dbEndpoint --stack "$PULUMI_STACK")"
DB_HOST="${DB_ENDPOINT%%:*}"
DB_PORT="${DB_ENDPOINT##*:}"
if [ "$DB_PORT" = "$DB_ENDPOINT" ]; then DB_PORT="5432"; fi
DB_SECRET_ARN="$(pulumi stack output dbSecretArn --stack "$PULUMI_STACK")"
LOCAL_DB_PORT="55438"
```

Se l'output `dbEndpoint` non include la porta, usa come `DB_PORT` la porta esportata dallo stack o quella configurata dal database, normalmente `5432` per PostgreSQL.

### Client eseguito fuori dalla VPC: aprire il tunnel

Verifica che l'istanza sia registrata e `Online` in Systems Manager:

```bash
aws ssm describe-instance-information \
  --region "$AWS_REGION" \
  --filters "Key=InstanceIds,Values=$DB_ADMIN_INSTANCE_ID" \
  --query 'InstanceInformationList[0].PingStatus' \
  --output text
```

Se il risultato e `Online`, avvia il tunnel in un terminale dedicato e lascialo aperto:

```bash
aws ssm start-session \
  --region "$AWS_REGION" \
  --target "$DB_ADMIN_INSTANCE_ID" \
  --document-name AWS-StartPortForwardingSessionToRemoteHost \
  --parameters "{\"host\":[\"$DB_HOST\"],\"portNumber\":[\"$DB_PORT\"],\"localPortNumber\":[\"$LOCAL_DB_PORT\"]}"
```

Sul computer locale deve essere installato il plugin AWS Session Manager. L'istanza amministrativa deve avere:

- SSM Agent attivo
- un instance role che permetta la registrazione a Systems Manager
- connettivita di rete verso Systems Manager e il database

Se il client gira gia sul nodo amministrativo, salta completamente questi comandi di port forwarding.

### Recuperare le credenziali del database

Se il secret di AWS Secrets Manager e un JSON con una proprieta `password`, su macOS copia la password negli appunti senza stamparla nel terminale:

```bash
aws secretsmanager get-secret-value \
  --region "$AWS_REGION" \
  --secret-id "$DB_SECRET_ARN" \
  --query SecretString \
  --output text | jq -r '.password' | pbcopy
```

Da PowerShell locale:

```powershell
$pulumiStack = "[stack]"
$awsRegion = pulumi config get aws:region --stack $pulumiStack
$dbSecretArn = pulumi stack output dbSecretArn --stack $pulumiStack
$secretJson = aws secretsmanager get-secret-value `
  --region $awsRegion `
  --secret-id $dbSecretArn `
  --query SecretString `
  --output text
$secret = $secretJson | ConvertFrom-Json
Set-Clipboard $secret.password
Remove-Variable secret, secretJson, dbSecretArn
```

Da PowerShell sul nodo amministrativo, AWS CLI puo usare l'instance role senza access key locali, se quel ruolo permette `secretsmanager:GetSecretValue` sul secret corretto. Ricevi regione e ARN del secret dall'operatore che ha selezionato lo stack, poi copia la password senza stamparla:

```powershell
$awsRegion = "[aws-region]"
$dbSecretArn = "[db-secret-arn]"
$secretJson = aws secretsmanager get-secret-value --region $awsRegion --secret-id $dbSecretArn --query SecretString --output text
$secret = $secretJson | ConvertFrom-Json
Set-Clipboard $secret.password
Remove-Variable secret, secretJson, dbSecretArn
```

Se `aws` non viene trovato sul nodo, AWS CLI non e installata o la sua directory non e nel `PATH`. La presenza di SSM Agent non implica la presenza di AWS CLI.

La password del database e distinta dalla password dell'utente Windows, Linux o macOS usata per entrare nel nodo. Per PostgreSQL usa username e password contenuti nel secret del database, non le credenziali del sistema operativo.

### Configurare il client fuori dalla VPC

Con il tunnel SSM aperto, configura il client con:

```text
Host: localhost
Porta: valore di LOCAL_DB_PORT, ad esempio 55438
Database: nome configurato dal progetto
Utente: utente configurato dal progetto
Password: valore copiato da Secrets Manager
SSL mode: modalita richiesta dallo stack, normalmente Require
```

Il terminale del tunnel deve restare aperto per tutta la durata della connessione. Al termine interrompi la sessione con `Ctrl+C`.

### Configurare pgAdmin sul nodo amministrativo

Se pgAdmin gira gia sul nodo amministrativo dentro la VPC, non usare `localhost` e non usare `LOCAL_DB_PORT`. Registra una nuova connessione al database privato:

```text
General > Name: nome descrittivo dell'ambiente

Connection:
Host name/address: valore di DB_HOST
Port: valore di DB_PORT, normalmente 5432
Maintenance database: nome del database configurato dal progetto
Username: utente contenuto nel secret del database
Password: password contenuta nel secret del database
Service: vuoto
Role: vuoto

SSL > SSL mode: modalita richiesta dallo stack, normalmente Require
```

Un'installazione PostgreSQL locale puo creare automaticamente in pgAdmin un server chiamato, ad esempio, `PostgreSQL 18`, e chiedere la password dell'utente `postgres`. Quel server rappresenta il PostgreSQL locale del nodo, non il database RDS o un altro database privato gestito dal progetto. Annulla quel prompt e usa `Servers > Register > Server` per creare la connessione descritta sopra, a meno che tu non voglia amministrare intenzionalmente il database locale.

Il campo `Name` e solo un'etichetta locale di pgAdmin. Non inserire il nome del database nei campi `Service` o `Role`: `Service` richiede una definizione in `pg_service.conf`, mentre `Role` serve per un eventuale `SET ROLE` successivo al login.

Non inserire nella guida o nella configurazione applicativa ID delle istanze, endpoint, ARN dei secret, account ID, regioni o password specifici di un ambiente. Ricavali sempre dallo stack selezionato. Non stampare i secret e non salvarli nella cronologia della shell o nei log.

## Creare la GitHub Action

Dopo aver configurato il progetto Pulumi, crea una GitHub Action dedicata all'infrastruttura.

La workflow va inserita sotto:

```text
.github/workflows/
```

Esempio:

```text
.github/
└── workflows/
    └── deploy-infra.yml
```

La GitHub Action dovrebbe essere adattata al progetto e puo occuparsi di:

- installare le dipendenze
- configurare le credenziali del cloud provider
- selezionare lo stack Pulumi corretto
- eseguire `pulumi preview`
- eseguire `pulumi up` quando previsto
- passare eventuali config o variabili richieste dal progetto
- usare i secrets GitHub necessari per autenticarsi verso cloud provider, registry o servizi esterni

La workflow deve essere generica rispetto al progetto, ma coerente con provider, stack e strategia di deploy.

Una base di template puo essere questa:

```yaml
name: Deploy

on:
  push:
    branches: [staging, main]
  pull_request:
    branches: [staging, main]

permissions:
  id-token: write
  contents: read

env:
  AWS_REGION: [region]

jobs:
  setup:
    name: Setup
    runs-on: ubuntu-latest
    outputs:
      env_name: ${{ steps.resolve.outputs.env_name }}
      env_suffix: ${{ steps.resolve.outputs.env_suffix }}
    steps:
      - name: Resolve environment name
        id: resolve
        run: |
          if [[ "${{ github.ref_name }}" == "main" ]]; then
            echo "env_name=prod" >> "$GITHUB_OUTPUT"
            echo "env_suffix=PROD" >> "$GITHUB_OUTPUT"
          else
            echo "env_name=staging" >> "$GITHUB_OUTPUT"
            echo "env_suffix=STAGING" >> "$GITHUB_OUTPUT"
          fi

  build-backend:
    name: Build Backend
    runs-on: ubuntu-latest
    needs: [setup]
    steps:
      - uses: actions/checkout@v4

      - name: Install backend dependencies
        run: |
          # installare le dipendenze del backend

      - name: Build backend
        run: |
          # buildare il backend secondo lo stack del progetto

      - name: Upload backend artifacts
        uses: actions/upload-artifact@v4
        with:
          name: backend-artifacts
          path: [backend-artifact-path]

  build-frontend:
    name: Build Frontend
    runs-on: ubuntu-latest
    needs: [setup]
    steps:
      - uses: actions/checkout@v4

      - name: Install frontend dependencies
        run: |
          # installare le dipendenze del frontend

      - name: Build frontend
        run: |
          # buildare il frontend secondo lo stack del progetto

      - name: Upload frontend artifacts
        uses: actions/upload-artifact@v4
        with:
          name: frontend-artifacts
          path: [frontend-artifact-path]

  pulumi-up:
    name: Pulumi Up
    runs-on: ubuntu-latest
    needs: [setup, build-backend, build-frontend]
    steps:
      - uses: actions/checkout@v4

      - name: Configure cloud credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ vars.AWS_ROLE_ARN }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Install Pulumi dependencies
        working-directory: infra/aws
        run: |
          # installare le dipendenze dell'infra

      - name: Pulumi login
        run: pulumi login "s3://[pulumi-state-bucket]"

      - name: Pulumi preview
        uses: pulumi/actions@v6
        with:
          command: preview
          stack-name: ${{ needs.setup.outputs.env_name }}
          work-dir: infra/aws

      - name: Pulumi up
        if: github.event_name == 'push'
        uses: pulumi/actions@v6
        with:
          command: up
          stack-name: ${{ needs.setup.outputs.env_name }}
          work-dir: infra/aws

  post-deploy:
    name: Post Deploy
    runs-on: ubuntu-latest
    needs: [setup, pulumi-up]
    if: github.event_name == 'push'
    steps:
      - name: Run post deploy steps
        run: |
          # eseguire eventuali step post deploy
          # esempi: wait del servizio, upload artifact statici, invalidazione cache
```

I passaggi di build backend e frontend devono restare agnostici rispetto al template: ogni progetto deve sostituire quei blocchi con i comandi reali del proprio stack applicativo.

## GitHub Actions - AWS OIDC Authentication

GitHub Actions should authenticate with AWS through OIDC federation instead of long-lived AWS access keys.

OIDC allows a GitHub workflow to assume an IAM role in AWS only for the duration of the workflow run. This is the recommended approach for CI/CD pipelines that need to deploy infrastructure or publish application artifacts to AWS.

### Deployment Overview

Document the repository-specific deployment details before configuring OIDC.

Example structure:

```text
GitHub repository: [github-org]/[github-repo]
Pulumi project: [pulumi-project]
AWS region: [aws-region]
Workflow file: .github/workflows/deploy.yml
```

If the workflow maps branches to Pulumi stacks, document the mapping clearly:

| Branch | Environment | Pulumi Stack |
|---|---|---|
| `[staging-branch]` | staging | `[staging-stack]` |
| `[production-branch]` | production | `[production-stack]` |

For each environment, document the infrastructure values used by the workflow and Pulumi stack:

| Value | Placeholder |
|---|---|
| Pulumi state bucket | `[pulumi-state-bucket]` |
| Pulumi secrets provider | `[pulumi-secrets-provider]` |
| Route53 hosted zone | `[route53-zone]` |
| Backend DNS | `[backend-dns]` |
| Frontend DNS | `[frontend-dns]` |
| GitHub Actions IAM role ARN | `[github-actions-role-arn]` |

Example with placeholders:

```text
GitHub repository: [github-org]/[github-repo]
Pulumi project: [pulumi-project]
AWS region: [aws-region]

Staging Pulumi state bucket: [project]-pulumi-staging
Staging Pulumi secrets provider: awskms://alias/[project]-pulumi-secrets-staging?region=[aws-region]
Staging Route53 zone: [staging-domain]
Staging backend DNS: api.[staging-domain]
Staging frontend DNS: fe.[staging-domain]
```

Keep this section project-specific in the final wiki page, but avoid committing real secrets or sensitive credentials.

### When This Is Needed

Configure AWS OIDC authentication when a GitHub Action needs to interact with AWS services, for example:

- running Pulumi from CI/CD
- reading or writing Pulumi state from an S3 backend
- pushing container images to ECR
- updating ECS services
- uploading static assets to S3
- invalidating CloudFront distributions
- managing DNS records in Route53
- creating or validating ACM certificates
- creating or updating IAM, VPC, security groups, load balancers, or other AWS resources

### Prerequisites

Before configuring OIDC, collect the project-specific values:

| Placeholder | Description |
|---|---|
| `[github-org]` | GitHub organization or user that owns the repository |
| `[github-repo]` | GitHub repository name |
| `[aws-account-id]` | AWS account ID where resources are deployed |
| `[aws-region]` | AWS region used by the project |
| `[role-name]` | IAM role name assumed by GitHub Actions |
| `[environment]` | Deployment environment, for example `staging` or `prod` |

### 1. Create the GitHub OIDC Provider in AWS

Create the OIDC identity provider once per AWS account.

From AWS Console:

```text
IAM > Identity providers > Add provider
```

Use:

| Field | Value |
|---|---|
| Provider type | `OpenID Connect` |
| Provider URL | `https://token.actions.githubusercontent.com` |
| Audience | `sts.amazonaws.com` |

The provider URL is the GitHub Actions OIDC issuer. The audience tells AWS STS that tokens from this provider are meant to be exchanged for temporary AWS credentials.

CLI equivalent:

```bash
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1
```

If the provider already exists in the AWS account, do not create it again.

### 2. Create the IAM Trust Policy

Create a `trust-policy.json` file and replace the placeholders with the values of the project:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::[aws-account-id]:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:[github-org]/[github-repo]:ref:refs/heads/*"
        }
      }
    }
  ]
}
```

The `sub` condition controls which repository and refs are allowed to assume the AWS role.

For stricter access, replace the wildcard branch condition with specific branches, for example:

```text
repo:[github-org]/[github-repo]:ref:refs/heads/staging
repo:[github-org]/[github-repo]:ref:refs/heads/main
```

### 3. Create the IAM Role

Create the IAM role that GitHub Actions will assume.

From AWS Console:

```text
IAM > Roles > Create role
```

Use:

| Field | Value |
|---|---|
| Trusted entity type | `Web identity` |
| Identity provider | `token.actions.githubusercontent.com` |
| Audience | `sts.amazonaws.com` |
| GitHub organization | `[github-org]` |
| GitHub repository | `[github-repo]` |
| Branch or ref | `[branch-name]` |
| Role name | `[role-name]` |

For a staging environment, a common generic role name is:

```text
[project-name]-github-actions-staging
```

For production:

```text
[project-name]-github-actions-prod
```

The role is separate from the OIDC provider:

```text
OIDC provider = AWS trusts GitHub Actions tokens
IAM role = this repository/ref can use these AWS permissions
```

CLI equivalent using the trust policy:

```bash
aws iam create-role \
  --role-name [role-name] \
  --assume-role-policy-document file://trust-policy.json
```

The role ARN will have this format:

```text
arn:aws:iam::[aws-account-id]:role/[role-name]
```

### 4. Attach IAM Permissions

Attach the permissions required by the workflow.

The exact permissions depend on the resources managed by the project. A typical infrastructure deployment role may need access to:

- ECR
- ECS
- S3
- CloudFront
- Route53
- ACM
- IAM
- EC2/VPC
- KMS
- CloudWatch Logs
- the Pulumi state backend

For an initial bootstrap, a broad policy can be used temporarily and scoped down later:

```bash
aws iam attach-role-policy \
  --role-name [role-name] \
  --policy-arn arn:aws:iam::aws:policy/AdministratorAccess
```

After the infrastructure is stable, replace broad permissions with a least-privilege policy.

### 5. Configure GitHub Repository Variables

In the GitHub repository, go to:

```text
Settings > Secrets and variables > Actions > Variables
```

Add the variables required by the workflow.

For a multi-environment workflow, use environment-specific names:

| Variable | Example Value |
|---|---|
| `AWS_ROLE_ARN_STAGING` | `arn:aws:iam::[aws-account-id]:role/[role-name]` |
| `AWS_ROLE_ARN_PROD` | `arn:aws:iam::[aws-account-id]:role/[role-name]` |
| `BACKEND_DNS_STAGING` | `[backend-staging-domain]` |
| `BACKEND_DNS_PROD` | `[backend-prod-domain]` |

If the workflow uses a single environment, a single variable such as `AWS_ROLE_ARN` may be enough.

### 6. Configure GitHub Environments

For multi-stage deployments, create one GitHub Environment for each deployment stage.

Common examples:

```text
staging
prod
```

In the GitHub repository, go to:

```text
Settings > Environments
```

Create the environments used by the workflow.

For each environment, configure the environment-specific variables and secrets needed by that stage.

Example environment variable layout:

| Environment | Variable | Example Placeholder |
|---|---|---|
| `staging` | `AWS_ROLE_ARN` | `arn:aws:iam::[aws-account-id]:role/[staging-role-name]` |
| `staging` | `BACKEND_DNS` | `[backend-staging-domain]` |
| `prod` | `AWS_ROLE_ARN` | `arn:aws:iam::[aws-account-id]:role/[prod-role-name]` |
| `prod` | `BACKEND_DNS` | `[backend-prod-domain]` |

Example environment secret layout:

| Environment | Secret | When It Is Needed |
|---|---|---|
| `staging` | `[SERVICE_TOKEN]` | staging token for an external service |
| `prod` | `[SERVICE_TOKEN]` | production token for an external service |

GitHub Environments are useful when:

- staging and production use different AWS roles
- staging and production use different domains
- production requires manual approval before deployment
- secrets should be scoped to a specific environment
- deployment history should be tracked per environment

A workflow can reference an environment like this:

```yaml
jobs:
  deploy:
    environment: staging
```

For dynamic environments resolved from a setup job:

```yaml
jobs:
  deploy:
    needs: [setup]
    environment: ${{ needs.setup.outputs.env_name }}
```

When using GitHub Environments, environment variables can be referenced with the same syntax as repository variables:

```yaml
${{ vars.AWS_ROLE_ARN }}
${{ vars.BACKEND_DNS }}
```

This keeps the workflow cleaner because the variable name stays the same while the value changes based on the selected environment.

### Alternative Without GitHub Environments

GitHub Environments are useful, but they are not mandatory.

A workflow can also use repository-level variables with environment suffixes. This approach is simpler when no manual approvals or environment-scoped secrets are needed.

Example repository variables:

| Variable | Example Placeholder |
|---|---|
| `AWS_ROLE_ARN_STAGING` | `arn:aws:iam::[aws-account-id]:role/[staging-role-name]` |
| `AWS_ROLE_ARN_PROD` | `arn:aws:iam::[aws-account-id]:role/[prod-role-name]` |
| `BACKEND_DNS_STAGING` | `[backend-staging-domain]` |
| `BACKEND_DNS_PROD` | `[backend-prod-domain]` |

The workflow can resolve the suffix in a setup job:

```yaml
jobs:
  setup:
    runs-on: ubuntu-latest
    outputs:
      env_name: ${{ steps.resolve.outputs.env_name }}
      env_suffix: ${{ steps.resolve.outputs.env_suffix }}
    steps:
      - name: Resolve environment name
        id: resolve
        run: |
          if [[ "${{ github.ref_name }}" == "main" ]]; then
            echo "env_name=prod" >> "$GITHUB_OUTPUT"
            echo "env_suffix=PROD" >> "$GITHUB_OUTPUT"
          else
            echo "env_name=staging" >> "$GITHUB_OUTPUT"
            echo "env_suffix=STAGING" >> "$GITHUB_OUTPUT"
          fi
```

Then later jobs can resolve the correct repository variable dynamically:

```yaml
role-to-assume: ${{ vars[format('AWS_ROLE_ARN_{0}', needs.setup.outputs.env_suffix)] }}
```

And similarly for project-specific values:

```yaml
BACKEND_DNS="${{ vars[format('BACKEND_DNS_{0}', needs.setup.outputs.env_suffix)] }}"
```

Use this approach when:

- the workflow should stay simple
- environment-level approvals are not required
- repository-level variables are enough
- staging and production still need different values

Use GitHub Environments instead when production needs approvals, stricter scoping, or separate environment deployment history.

### 7. Configure GitHub Repository Secrets

In the GitHub repository, go to:

```text
Settings > Secrets and variables > Actions > Secrets
```

Add only the secrets required by the pipeline.

Examples:

| Secret | When It Is Needed |
|---|---|
| `[EXTERNAL_SERVICE_TOKEN]` | Authentication with a third-party service |
| `[REGISTRY_TOKEN]` | Authentication with a non-AWS container registry |
| `[FRONTEND_PROVIDER_TOKEN]` | Deployment to an external frontend hosting provider |

Do not store long-lived AWS access keys when OIDC is available.

### 8. Reference the Role in the Workflow

Use `aws-actions/configure-aws-credentials` in the workflow:

```yaml
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: ${{ vars.AWS_ROLE_ARN_STAGING }}
    aws-region: [aws-region]
```

For environment-aware workflows, resolve the variable dynamically:

```yaml
role-to-assume: ${{ vars[format('AWS_ROLE_ARN_{0}', needs.setup.outputs.env_suffix)] }}
```

### 9. Optional External Frontend Deployment

If the frontend is deployed outside AWS, add a dedicated deployment job after the infrastructure deployment.

That job should be configured with provider-specific variables and secrets, such as:

- provider token
- project ID
- organization or team ID
- frontend environment variables
- backend public URL

Keep this section optional. If the frontend is deployed to S3 and CloudFront, these external provider secrets are not needed.

### 10. GitHub CLI Examples

Variables and secrets can also be configured with the GitHub CLI:

```bash
gh variable set AWS_ROLE_ARN_STAGING --repo [github-org]/[github-repo] --body "arn:aws:iam::[aws-account-id]:role/[role-name]"
gh variable set AWS_ROLE_ARN_PROD --repo [github-org]/[github-repo] --body "arn:aws:iam::[aws-account-id]:role/[role-name]"
gh variable set BACKEND_DNS_STAGING --repo [github-org]/[github-repo] --body "[backend-staging-domain]"
gh variable set BACKEND_DNS_PROD --repo [github-org]/[github-repo] --body "[backend-prod-domain]"

gh secret set [SECRET_NAME] --repo [github-org]/[github-repo]
```

### Esempio con commit hash

In alcuni progetti, la pipeline puo usare il commit hash come identificativo della versione da deployare.

In questo scenario, la GitHub Action puo:

- calcolare il commit hash corrente
- buildare l'immagine applicativa
- pubblicare l'immagine su un container registry usando il commit hash come tag
- passare quel valore a Pulumi come config o variabile di deploy

Esempio concettuale:

```bash
COMMIT_HASH=$(git rev-parse --short HEAD)

docker build -t my-app:$COMMIT_HASH .
docker tag my-app:$COMMIT_HASH [registry-url]/my-app:$COMMIT_HASH
docker push [registry-url]/my-app:$COMMIT_HASH

pulumi config set commitHash "$COMMIT_HASH"
pulumi up
```

Il commit hash non e obbligatorio in assoluto: e solo un modo comune per rendere tracciabile quale versione dell'applicazione viene deployata.

## Ordine consigliato

Il flusso corretto da seguire e:

```bash
mkdir infra
cd infra
mkdir aws
cd aws

aws configure
pulumi login s3://[bucket-or-path]
pulumi new aws-typescript
pulumi stack change-secrets-provider \
  "awskms://alias/[slug]?region=[region]"

# dopo la configurazione base, copiare dal template aws-infra-template
# le cartelle components e lib dentro la cartella del provider, es. infra/aws

# copiare dal template anche le config non sensibili

# poi impostare o modificare eventuali config non sensibili
pulumi config set [nome-config] "[valore]"

# infine reinserire i secrets
pulumi config set --secret [nome-secret] "[valore]"

# adattare index.ts per usare davvero components e lib copiati dal template

# verificare cosa verra creato prima del deploy
pulumi preview
```
