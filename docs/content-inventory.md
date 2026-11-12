# Content inventory

Processed: 6 decks, 441 slides, 50 original Quizlet cards, 108 additional questions, 158 total unique question records, 43 theory topics.

| Module | Slides | Original cards | Added | Total |
|---|---:|---:|---:|---:|
| 1. Welcome to cloud developing | 39 | 0 | 12 | 12 |
| 2. Developing on AWS | 61 | 10 | 14 | 24 |
| 3. Storage with Amazon S3 | 54 | 10 | 15 | 25 |
| 4. Securing cloud resources | 64 | 10 | 13 | 23 |
| 5. Flexible NoSQL with DynamoDB | 84 | 10 | 27 | 37 |
| 6. REST APIs with API Gateway | 139 | 10 | 27 | 37 |

No identical cards removed. One ambiguous original SDK card is self-assessed and excluded from automatic exam scoring. See the Sources screen and content source fields for all corrections.

## Module 1

- **Course scope and prerequisites** (slides 4–19): SDK, API, Git, SQL, NoSQL
- **The café business case** (slides 20–25, 39): S3, DynamoDB, API Gateway, Lambda, proof of concept
- **Roles and responsibilities** (slides 26–32): DevOps, cloud architect, developer, IT leader
- **Finding dependable documentation** (slides 33–37): developer guide, API reference, whitepaper

## Module 2

- **Systems development lifecycle** (slides 7–11, 55): SDLC, Waterfall, Agile, sprint
- **Getting ready to develop** (slides 12–20, 56–58): IDE, IAM, AWS CLI, AWS SAM, Amplify
- **AWS CLI and CloudShell** (slides 20–23, 32–36, 61): CloudShell, command, subcommand, parameter
- **Clients, resources and endpoints** (slides 24–28, 59–60): Boto3, service client, resource API, endpoint
- **Regions, profiles and exceptions** (slides 29–31): region_name, ClientError, HTTP 4xx, HTTP 5xx, request ID
- **Amazon Q Developer and validation** (slides 37–44, 48–50): Amazon Q Developer, code review, unit test, security scan

## Module 3

- **Object storage and use cases** (slides 5–11, 47): bucket, object, key, durability, data lake
- **Bucket names, Regions and URLs** (slides 12–17, 48): virtual-hosted URL, Region, namespace
- **Keys, prefixes and metadata** (slides 16, 19–22): prefix, metadata, Content-Type, GET, PUT
- **Single PUT and multipart upload** (slides 20–21): multipart, part, throughput
- **Versioning and deletion** (slides 23–26, 42–44, 50–51): version ID, delete marker, Object Lock
- **Encryption and access policies** (slides 27–31, 52–53): TLS, SSE-S3, SSE-KMS, SSE-C, bucket policy, ACL
- **Presigned URLs, CORS and the lab** (slides 32–38, 54): presigned URL, expiration, CORS, origin

## Module 4

- **Shared responsibility** (slides 5–12, 53): shared responsibility, guest OS, security group
- **Authentication, authorization and MFA** (slides 13–20, 54–55): principal, authentication, authorization, MFA
- **Users, groups, roles and credentials** (slides 21–25, 56, 58–64): IAM role, temporary credentials, profile, trust policy
- **Policy structure and attachment** (slides 26–32): Effect, Action, Resource, Principal, managed policy, inline policy
- **Evaluation, explicit deny and least privilege** (slides 33–43, 47–49, 57): implicit deny, explicit deny, NotResource, least privilege

## Module 5

- **Choosing a database** (slides 5–14): RDS, Aurora, DynamoDB, ElastiCache, Neptune
- **Tables, items and keys** (slides 15–19, 77): table, item, attribute, partition key, sort key, map, list
- **Partitions and access patterns** (slides 20–24): hash key, range key, partition, hot key
- **Global and local secondary indexes** (slides 25–29): GSI, LSI, projection
- **Read consistency and transactions** (slides 30–32, 40, 62): eventual consistency, strong consistency, ACID, transaction
- **Read and write capacity calculations** (slides 33–40, 78): RCU, WCU, provisioned, on-demand
- **Streams and global tables** (slides 41–47, 71–73, 79–83): stream record, shard, replica, last writer wins, MREC, MRSC
- **Backups and recovery** (slides 48–49, 84): on-demand backup, PITR, restore
- **Control, data and conditional operations** (slides 50–57, 63–67): CreateTable, PutItem, UpdateItem, DeleteItem, GetItem, ConditionExpression
- **Query, Scan, pagination and batches** (slides 58–62): Query, Scan, FilterExpression, LastEvaluatedKey, ExclusiveStartKey, BatchWriteItem

## Module 6

- **APIs, REST and WebSockets** (slides 5–23, 104–111): API, REST, WebSocket, proxy, stateless
- **REST APIs versus HTTP APIs** (slides 18, 22, 109, 114): REST API, HTTP API, OpenAPI, SAM, CloudFormation, CDK
- **Resources, methods and routes** (slides 24–33, 112–113): GET, PUT, POST, route-key, proxy+, OpenAPI
- **Endpoint types and private integration** (slides 35–38, 47–49, 114–117, 121–122): Regional, edge-optimized, private endpoint, VPC link
- **Proxy, non-proxy and mock integrations** (slides 37–46, 50–53, 116–120, 123): Lambda proxy, mapping template, VTL, mock, first-class integration
- **Deployments, stages and canaries** (slides 54–60, 97–99, 124–125): deployment, stage, stage variable, canary, alias
- **Resource policies, certificates and WAF** (slides 61–66, 126–127): resource policy, ACM, client certificate, WAF, SQL injection, XSS
- **CORS and browser requests** (slides 67–69, 128–130): same-origin policy, CORS, OPTIONS, preflight
- **Throttling, usage plans and authorization** (slides 70–79, 131–136): throttling, usage plan, API key, JWT, Cognito, Lambda authorizer
- **Monitoring, caching and compression** (slides 80–87, 137–138): Latency, IntegrationLatency, CloudWatch, X-Ray, CloudTrail, Config, cache, gzip
- **Putting the café API together** (slides 88–93, 139): mock endpoint, FoodProducts, create_report