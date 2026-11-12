import type { Question, Difficulty, Kind } from "./types";
import { modules } from "./theory";
import { originalCards } from "./flashcards";
const generated: Question[] = [];
function q(
  topic: string,
  prompt: string,
  correct: string,
  wrong: string[],
  explanation: string,
  difficulty: Difficulty = "Medium",
) {
  const module = Number(topic[0]);
  const t = modules[module - 1].topics.find((t) => t.id === topic)!;
  const options = [correct, ...wrong];
  const shift = generated.length % options.length;
  generated.push({
    id: `l${module}-${generated.length + 1}`,
    module,
    topic,
    prompt,
    options: [...options.slice(shift), ...options.slice(0, shift)],
    answer: [correct],
    explanation,
    difficulty,
    type: "single",
    source: "Lecture-Based",
    reference: `M0${module} slides ${t.slides}`,
  });
}
function textQ(
  topic: string,
  prompt: string,
  answer: string[],
  explanation: string,
  type: Kind = "blank",
  difficulty: Difficulty = "Medium",
) {
  const module = Number(topic[0]);
  const t = modules[module - 1].topics.find((t) => t.id === topic)!;
  generated.push({
    id: `l${module}-${generated.length + 1}`,
    module,
    topic,
    prompt,
    answer,
    explanation,
    difficulty,
    type,
    source: "Lecture-Based",
    reference: `M0${module} slides ${t.slides}`,
  });
}
q(
  "1-scope",
  "Which preparation best matches the course prerequisites?",
  "Programming and SDK experience plus command-line and AWS fundamentals",
  [
    "Only spreadsheet experience",
    "Expertise in every AWS service",
    "No programming background",
  ],
  "The course assumes working knowledge of one supported language, an SDK, operating systems, APIs and foundational cloud concepts.",
  "Easy",
);
q(
  "1-scope",
  "Which subject is only previewed as a later module in the supplied Module 1 roadmap?",
  "Container deployment",
  ["S3 object operations", "IAM permissions", "DynamoDB keys"],
  "Module 8 covers containers. The supplied Modules 3–5 teach S3, IAM and DynamoDB in detail.",
  "Easy",
);
q(
  "1-cafe",
  "Who contributes programming skills while managing the café supply chain?",
  "Sofía",
  ["Frank", "Martha", "Olivia"],
  "Sofía manages supply and begins developing with AWS. Frank bakes, Martha has accounting experience, and Olivia is a consultant.",
  "Easy",
);
q(
  "1-cafe",
  "Which consultant emphasizes automation, backups and disaster recovery?",
  "Mateo",
  ["Faythe", "Nikhil", "Frank"],
  "Mateo is the systems administrator/engineer. Faythe specializes in development and security; Nikhil contributes design.",
  "Easy",
);
q(
  "1-cafe",
  "In the café architecture, what sits between API Gateway and DynamoDB to perform database lookups?",
  "Lambda function",
  ["The static HTML file alone", "An IAM group", "A CloudShell terminal"],
  "The architecture assigns database lookup logic to Lambda, with API Gateway presenting the API and DynamoDB storing data.",
  "Easy",
);
q(
  "1-roles",
  "Which role is primarily responsible for managing an IT team and budget?",
  "IT leader",
  ["Application developer", "DevOps engineer", "Database item"],
  "IT leaders manage teams, day-to-day operations, budgets and technology choices.",
  "Easy",
);
q(
  "1-roles",
  "A team needs infrastructure automation following the architect’s guidelines. Which role most directly fits?",
  "DevOps engineer",
  ["IT budget owner", "Visual designer", "End user"],
  "DevOps engineers build infrastructure and repeatable delivery processes.",
);
q(
  "1-roles",
  "Who evaluates cost, reliability, security and performance across the solution design?",
  "Cloud architect",
  [
    "Only the café co-owner",
    "Only an application tester",
    "Only a content editor",
  ],
  "Architects guide technology choices and cross-system best practices.",
);
q(
  "1-docs",
  "Where should you check the exact request parameters and returned fields for a Boto3 method?",
  "The SDK API reference",
  [
    "A promotional overview",
    "An unrelated service FAQ",
    "The certification badge page",
  ],
  "The API reference defines method contracts. Guides explain concepts and tutorials illustrate workflows.",
  "Easy",
);
textQ(
  "1-docs",
  "Explain how you would verify a sample SDK call before using it.",
  [
    "Find its official API reference; check parameters, Region, permissions, return structure and errors; test it with a limited identity.",
  ],
  "Self-assess against the reference. A good answer includes contract, permission and error checks, not just copying code.",
  "short",
);
q(
  "2-sdlc",
  "Which activity belongs most directly to the build step?",
  "Compile code and run unit tests",
  [
    "Choose business requirements",
    "Monitor production errors",
    "Publish a production release",
  ],
  "The lecture places compilation, unit tests, style checks, metrics and image creation in build.",
);
q(
  "2-sdlc",
  "Which test assesses behavior under heavy traffic?",
  "Load test",
  ["Style check", "Source check-in", "Compilation"],
  "Load testing evaluates capacity and behavior under demand; the other operations do not simulate heavy traffic.",
  "Easy",
);
q(
  "2-sdlc",
  "Which methodology emphasizes repeated short development cycles?",
  "Agile",
  [
    "Waterfall only",
    "A single final release with no iterations",
    "Credential rotation",
  ],
  "Agile iterates through sprints, while the lecture contrasts Waterfall’s phase sequence.",
  "Easy",
);
q(
  "2-cli",
  "What does aws ec2 describe-instances help request?",
  "Help for a specific EC2 operation",
  [
    "A list of all IAM policies",
    "A new EC2 instance",
    "A compilation of source code",
  ],
  "CLI help can be requested at the root, service or operation level.",
  "Easy",
);
q(
  "2-cli",
  "Why does CloudShell not require manually entering access keys for its ordinary console-launched session?",
  "It uses the signed-in console identity’s pre-authenticated context",
  [
    "It bypasses IAM",
    "All AWS APIs are anonymous",
    "It uses the root user for every account",
  ],
  "CloudShell is pre-authenticated but still constrained by the session’s permissions.",
);
q(
  "2-sdk",
  "What is an AWS service endpoint?",
  "The URL receiving service requests",
  [
    "The secret access key",
    "The local source-code folder",
    "A database sort key",
  ],
  "An endpoint is the entry URL for a web service.",
  "Easy",
);
textQ(
  "2-sdk",
  "What is the name of the AWS SDK for Python?",
  ["Boto3"],
  "Boto3 is the Python SDK used throughout the course.",
);
q(
  "2-config",
  "Where does the lecture place a default AWS Region for local CLI/SDK configuration?",
  "~/.aws/config",
  [
    "A public source file",
    "The object’s Content-Type metadata",
    "Only in ~/.aws/credentials",
  ],
  "Region settings belong in the configuration file; credentials have a separate purpose.",
);
q(
  "2-config",
  "A transient service-side 5xx failure occurs. What is the best response?",
  "Retry with bounded exponential backoff",
  [
    "Retry forever with no delay",
    "Delete the account",
    "Treat the response as a successful write",
  ],
  "The course recommends retrying server errors; bounded backoff avoids uncontrolled retry storms.",
);
q(
  "2-q",
  "After Q proposes a feature and a file diff, what should the developer do?",
  "Review the changes and run appropriate validation",
  [
    "Publish immediately because AI generated it",
    "Only rename the files",
    "Disable all tests",
  ],
  "The illustrated workflow explicitly includes review, insertion and validation.",
);
textQ(
  "2-config",
  "Why is an unchanged retry unlikely to fix a NoSuchKey error?",
  [
    "The requested object key does not exist; correct the key or create the object instead of repeatedly issuing the same invalid request.",
  ],
  "Self-assess: identify missing resource and distinguish it from a transient server failure.",
  "short",
);
q(
  "3-basics",
  "S3’s “11 nines” design figure in the lecture refers to what?",
  "Durability",
  [
    "Website uptime guarantee",
    "Object download speed",
    "Percentage of encrypted requests",
  ],
  "Durability concerns preservation of stored data, not availability or transfer speed.",
);
q(
  "3-buckets",
  "Which three concerns guide selecting a bucket Region?",
  "Latency, cost and regulatory requirements",
  [
    "Folder color, filename extension and browser font",
    "Only the developer’s username",
    "The number of IAM group members",
  ],
  "The Region selection slide names latency, cost and regulatory constraints.",
  "Easy",
);
q(
  "3-objects",
  "What does menu/drinks/coffee.jpg represent in an S3 bucket?",
  "One object key with a prefix",
  [
    "Three separate nested buckets",
    "A real operating-system directory tree",
    "An IAM role path",
  ],
  "Slashes are characters in a flat key namespace, though consoles display them like folders.",
);
q(
  "3-objects",
  "Which is user-defined metadata?",
  "x-amz-meta-alt-name",
  [
    "The system-maintained object size",
    "The automatically assigned version ID",
    "The service’s creation timestamp",
  ],
  "The x-amz-meta prefix marks custom metadata; size, version and creation information are system metadata.",
);
q(
  "3-objects",
  "Which operation retrieves only part of an object’s bytes?",
  "GET with a byte range",
  ["DELETE with a prefix", "CreateBucket with a range", "ListBuckets"],
  "A range GET retrieves selected bytes of one object. Listing operations enumerate object keys or buckets.",
);
q(
  "3-upload",
  "A 7 GB file must be uploaded under the lecture’s single-PUT limit. What should be used?",
  "Multipart upload",
  ["One 7 GB PUT", "A bucket ACL", "A CORS preflight"],
  "It exceeds 5 GB, so the upload must be split into parts.",
  "Easy",
);
q(
  "3-upload",
  "Why can multipart improve upload recovery?",
  "Failed parts can be retried independently",
  [
    "It grants public write access",
    "It disables checksums",
    "It removes the need to complete an upload",
  ],
  "Independent parts avoid restarting the entire object transfer.",
);
q(
  "3-version",
  "What normally happens when a key is deleted without a version ID in a versioning-enabled bucket?",
  "A delete marker becomes current",
  [
    "Every old version is immediately erased",
    "Versioning is disabled",
    "A new bucket is created",
  ],
  "Earlier versions remain available. The marker hides the object from ordinary current-version retrieval.",
);
q(
  "3-version",
  "Which action can permanently remove an old object version, if permitted?",
  "Delete specifying that version ID",
  ["List its prefix", "Suspend versioning alone", "Retrieve it with GET"],
  "Deleting a specific version removes that version, unlike an ordinary delete marker.",
  "Hard",
);
q(
  "3-security",
  "Which at-rest option uses KMS-managed keys?",
  "SSE-KMS",
  ["TLS", "CORS", "A presigned GET alone"],
  "SSE-KMS is server-side encryption integrated with AWS KMS. TLS protects transport.",
  "Easy",
);
q(
  "3-urls",
  "A signed URL expires in seven days but its signing session expires in one hour. What constrains access?",
  "The signing credentials can make it expire sooner",
  [
    "The URL always lasts exactly seven days",
    "The URL becomes permanent",
    "It switches to anonymous access",
  ],
  "Presigned access is bounded by credential validity as well as the requested expiration.",
  "Hard",
);
textQ(
  "3-version",
  "Describe how to recover from an accidental ordinary delete in a versioning-enabled bucket.",
  [
    "Find a retained version and retrieve or restore it, or remove the delete marker if permitted. Earlier versions remain unless separately deleted.",
  ],
  "Self-assess: distinguish a marker from version-specific permanent deletion.",
  "short",
);
q(
  "4-shared",
  "For an EC2-hosted application, which task remains the customer’s responsibility?",
  "Configuring and patching the guest OS",
  [
    "Securing AWS’s physical datacenter",
    "Replacing AWS physical disks",
    "Maintaining the hypervisor hardware",
  ],
  "The customer administers the EC2 guest OS and application; AWS handles underlying infrastructure.",
);
q(
  "4-auth",
  "A valid user is denied DeleteTable. Which distinction explains this?",
  "Authentication succeeded but authorization did not permit the action",
  [
    "Passwords automatically grant every action",
    "Authentication means the user is root",
    "MFA always overrides policy denies",
  ],
  "Identity proof does not imply permission for every operation.",
);
q(
  "4-auth",
  "What does MFA add?",
  "Another authentication factor",
  [
    "Automatic administrator permissions",
    "A database replica",
    "An exception to explicit deny",
  ],
  "MFA adds identity assurance, not permissions.",
  "Easy",
);
q(
  "4-roles",
  "What selects a named credential context in boto3.Session?",
  "profile_name",
  ["ContentType", "SortKey", "minimumCompressionSize"],
  "profile_name selects a named AWS profile. Other options belong to unrelated services.",
);
q(
  "4-roles",
  "Which role policy controls who may assume the role?",
  "Trust policy",
  [
    "An S3 CORS document",
    "A response mapping template",
    "A DynamoDB index projection",
  ],
  "Trust determines who may assume; permissions determine actions once assumed.",
);
q(
  "4-policy",
  "Which policy arrangement offers reuse across several identities?",
  "Managed policy",
  [
    "A single identity’s inline policy",
    "A CORS rule",
    "An object metadata pair",
  ],
  "Managed policies are standalone and can attach to multiple identities.",
);
q(
  "4-policy",
  "Which policy field identifies the target resource ARN?",
  "Resource",
  ["Effect", "Version", "Sid"],
  "Resource selects targets; Effect states Allow/Deny, Version selects language version and Sid labels a statement.",
  "Easy",
);
q(
  "4-policy",
  "An inline permission policy embedded in an IAM role is which type?",
  "Identity-based",
  [
    "Resource-based because it is inline",
    "A network security group",
    "A CORS configuration",
  ],
  "The lecture’s contrary label on slide 32 is a documented error. Inline identity permission policies remain identity-based.",
);
q(
  "4-eval",
  "A deny statement excludes one bucket using NotResource. Does that statement itself allow the excluded bucket?",
  "No; an applicable allow is still needed",
  [
    "Yes, an exception always grants full access",
    "Yes, but only to root",
    "It makes the bucket public",
  ],
  "NotResource controls the deny’s matching set. Exceptions to denial are not grants.",
  "Hard",
);
textQ(
  "4-eval",
  "An explicit ______ overrides an applicable allow.",
  ["deny"],
  "IAM evaluation gives explicit deny precedence.",
);
textQ(
  "4-roles",
  "Explain how to replace long-lived keys baked into an EC2 AMI.",
  [
    "Use an instance profile with an IAM role limited to the required actions; let the SDK obtain temporary role credentials instead of embedding keys.",
  ],
  "Self-assess: role, temporary credentials, least privilege and removal of baked-in secrets should all appear.",
  "short",
);
q(
  "5-options",
  "Which listed AWS service is designed for graph relationships?",
  "Neptune",
  ["DynamoDB", "S3", "CloudShell"],
  "Neptune is the graph option; DynamoDB is key-value/document, S3 object storage and CloudShell a shell.",
  "Easy",
);
q(
  "5-keys",
  "Two items in one DynamoDB table can differ in which way?",
  "Their non-key attributes can differ",
  [
    "One may omit its required partition key",
    "Both may share an identical complete primary key",
    "An item can redefine the table’s key schema",
  ],
  "Non-key attributes are flexible, but required keys and uniqueness still apply.",
);
q(
  "5-index",
  "Which attributes are always represented in a secondary index besides its own alternate keys?",
  "Base-table primary-key attributes",
  [
    "Every possible application attribute",
    "Only binary attributes",
    "Only fields named id",
  ],
  "Indexes include base keys and selected projected attributes so entries identify base items.",
);
q(
  "5-index",
  "Which read setting is unsupported for a GSI query?",
  "Strongly consistent read",
  [
    "Eventually consistent read",
    "Partition-key condition",
    "Projection expression",
  ],
  "GSIs support eventually consistent reads only.",
  "Hard",
);
q(
  "5-consistency",
  "Which read mode may return slightly stale data soon after a write?",
  "Eventually consistent",
  ["Strongly consistent", "A transactional write", "A conditional write"],
  "Eventual reads trade freshness for lower read capacity requirements.",
  "Easy",
);
q(
  "5-capacity",
  "How many RCUs support 20 eventual reads/sec of 11 KB items?",
  "30",
  ["60", "55", "20"],
  "ceil(11/4)=3 blocks; 20×3/2=30 RCUs.",
  "Hard",
);
q(
  "5-capacity",
  "How many WCUs support 120 writes/minute of 7 KB items?",
  "14",
  ["840", "120", "7"],
  "120/60=2 writes/sec, each needing 7 WCUs; 2×7=14.",
  "Hard",
);
q(
  "5-capacity",
  "How many RCUs support 10 strong reads/sec of 5 KB items?",
  "20",
  ["10", "12.5", "5"],
  "Each 5 KB item rounds to two 4 KB units; 10×2=20.",
  "Hard",
);
q(
  "5-capacity",
  "How many WCUs support 3 writes/sec of 1.2 KB items?",
  "6",
  ["3.6", "3", "4"],
  "Round each item up to 2 KB; 3×2=6 WCUs.",
  "Hard",
);
q(
  "5-capacity",
  "Which capacity mode suits a new table with unknown unpredictable traffic?",
  "On-demand",
  [
    "A fixed low provisioned setting without adjustment",
    "Disable reads",
    "Use only one partition-key value",
  ],
  "The lecture recommends on-demand when workload is unknown or unpredictable.",
);
q(
  "5-streams",
  "What is a shard in a DynamoDB stream?",
  "A container of stream records",
  ["A bucket policy", "A SQL join", "A static website route"],
  "The stream diagram groups change records in shards.",
);
q(
  "5-streams",
  "Under the lecture’s eventual global-table model, red is written at 11:21:03 and green at 11:21:04 to the same item. Which value wins?",
  "Green",
  [
    "Red",
    "Both become separate permanent items",
    "The table becomes read-only",
  ],
  "The illustrated eventual-consistency conflict rule is last writer wins. This question is explicitly about that lecture model.",
);
q(
  "5-backup",
  "Why is cross-Region replication not a complete substitute for backups?",
  "Unwanted changes can replicate too",
  [
    "Replication stores no data",
    "Backups are only for relational databases",
    "Global tables never copy deletes",
  ],
  "Replication improves geographic availability; recovery history protects against unwanted changes.",
);
q(
  "5-crud",
  "Calling PutItem with the full primary key of an existing item normally does what?",
  "Replaces the existing item",
  [
    "Updates only supplied non-key fields while preserving all others",
    "Always raises a duplicate-key error",
    "Creates two items with the same key",
  ],
  "PutItem replaces the item unless a condition prevents it. UpdateItem is for attribute-level changes.",
);
q(
  "5-crud",
  "Which expression should prevent a write unless a business condition holds?",
  "ConditionExpression",
  ["ProjectionExpression", "A CORS rule", "Cache-Control"],
  "A condition expression gates the write; projection selects returned fields.",
);
q(
  "5-query",
  "A Query returns no items but includes LastEvaluatedKey. What should pagination code do?",
  "Continue using it as ExclusiveStartKey",
  [
    "Assume the table is empty",
    "Restart from the first page",
    "Delete the index",
  ],
  "Filtering can remove every item on a page while more evaluated pages remain.",
  "Hard",
);
q(
  "5-query",
  "Does adding a FilterExpression reduce read capacity consumed for items already read by Query?",
  "No",
  [
    "Yes, always to zero",
    "Only if it returns one attribute",
    "Only if it uses a Boolean field",
  ],
  "Filters apply after the read, so evaluated-item capacity is still consumed.",
  "Hard",
);
q(
  "5-query",
  "What does Query Limit restrict?",
  "The maximum items evaluated before filtering",
  [
    "The exact number returned after filtering",
    "The number of tables in the account",
    "The number of available indexes",
  ],
  "The lecture wording is corrected against the API contract: evaluated items may be filtered out.",
  "Hard",
);
q(
  "5-query",
  "Which operation supports at most 25 put/delete requests per batch?",
  "BatchWriteItem",
  ["BatchGetItem", "TransactGetItems", "GetItem"],
  "The lecture contrasts BatchWriteItem’s 25 requests with BatchGetItem’s 100 items, both with a 16 MB limit.",
);
q(
  "5-query",
  "A BatchWriteItem call returns unprocessed items. What is appropriate?",
  "Retry those unprocessed items with backoff",
  [
    "Assume the entire batch was rolled back",
    "Delete successful items to undo the batch",
    "Ignore all remaining items",
  ],
  "A batch is not an atomic transaction; partial success is possible.",
);
textQ(
  "5-capacity",
  "Give the RCU count for 8 eventual reads/sec of 9 KB items. Enter only the number.",
  ["12"],
  "ceil(9/4)=3; 8×3/2=12 RCUs.",
  "blank",
  "Hard",
);
textQ(
  "5-query",
  "Compare Query and Scan, including the role of filters.",
  [
    "Query selects by partition key and optional sort-key conditions. Scan reads across the table/index. Filters apply after reading and do not remove consumed read capacity.",
  ],
  "Self-assess against all three distinctions: access path, scope and filtering cost.",
  "short",
);
q(
  "6-routes",
  "What does {proxy+} represent in an API route?",
  "A greedy path variable capturing multiple segments",
  [
    "An authorization token",
    "A deployment version",
    "A single fixed literal product ID",
  ],
  "A greedy variable matches a hierarchy of path segments.",
);
q(
  "6-routes",
  "Which format can describe an importable API definition?",
  "OpenAPI in JSON or YAML",
  ["Only a screenshot", "Only a compiled binary", "Only a CSV of passwords"],
  "API Gateway can import supported OpenAPI definitions.",
  "Easy",
);
q(
  "6-endpoints",
  "Which REST endpoint uses a fully managed CloudFront distribution?",
  "Edge-optimized",
  ["Private", "Regional without a distribution", "A DynamoDB stream"],
  "The lecture distinguishes edge-optimized, Regional and private endpoints.",
);
q(
  "6-endpoints",
  "What connects API Gateway to supported private backend resources in a VPC?",
  "VPC link",
  ["A public bucket ACL", "An S3 object prefix", "A Query FilterExpression"],
  "A VPC link supports private integration; it is distinct from a client-facing private endpoint.",
);
q(
  "6-mapping",
  "Which integration lets a front end test responses without an implemented backend?",
  "Mock integration",
  ["An LSI", "A role trust relationship", "A backup restore"],
  "A mock integration returns configured responses without calling a real backend.",
  "Easy",
);
q(
  "6-mapping",
  "What language is used in the lecture’s REST request-mapping templates?",
  "Velocity Template Language (VTL)",
  ["SQL only", "CSS", "CSV"],
  "VTL mapping templates can transform request and response bodies.",
  "Easy",
);
q(
  "6-mapping",
  "A first-class HTTP API integration connects directly to which example?",
  "SQS SendMessage",
  [
    "An arbitrary third-party provider by definition",
    "A local browser filesystem",
    "A CSS animation",
  ],
  "The lecture shows supported AWS service action integrations such as SQS-SendMessage and StepFunctions-StartExecution.",
);
q(
  "6-stage",
  "What is the purpose of a canary rollout?",
  "Send a fraction of traffic to a candidate version",
  [
    "Force every client to upgrade immediately",
    "Disable monitoring",
    "Create an IAM root user",
  ],
  "Canaries expose a limited share of traffic while observing the new version.",
);
q(
  "6-stage",
  "A REST API definition was edited but production still behaves as before. What likely remains?",
  "Create a deployment and associate it with the production stage",
  [
    "Rename every product key",
    "Delete CloudWatch logs",
    "Enable bucket versioning",
  ],
  "A manually deployed REST stage references a deployment; editing the API definition alone does not update that deployment.",
);
q(
  "6-protect",
  "Which service manages the custom-domain TLS certificates in the lecture?",
  "AWS Certificate Manager",
  ["DynamoDB", "SQS", "AWS Config"],
  "ACM is the certificate-management service. Config assesses configuration; it is not the certificate issuer/manager in this workflow.",
  "Easy",
);
q(
  "6-cors",
  "Which HTTP method commonly performs a CORS preflight?",
  "OPTIONS",
  ["DELETE", "TRACE only", "PUT"],
  "The browser can use OPTIONS to ask whether the requested origin, method and headers are permitted.",
  "Easy",
);
q(
  "6-cors",
  "Does enabling CORS authenticate a caller?",
  "No",
  [
    "Yes, it validates every bearer token",
    "Yes, it grants an IAM role",
    "Yes, it requires a password",
  ],
  "CORS is enforced by browsers and does not replace authentication or authorization.",
);
q(
  "6-throttle",
  "Which control meters different REST API clients with quotas and throttling settings?",
  "Usage plan",
  [
    "An object version ID",
    "A DynamoDB partition",
    "An SDK resource collection",
  ],
  "Usage plans define client consumption settings, typically associated with API keys.",
);
q(
  "6-throttle",
  "A team needs custom token-validation logic for API access. What fits?",
  "Lambda authorizer",
  ["A cache key alone", "Payload compression", "A stage name alone"],
  "A Lambda authorizer executes custom authorization logic.",
);
q(
  "6-monitor",
  "Which service records actions by users, roles or AWS services on API Gateway?",
  "CloudTrail",
  ["CloudFront", "ElastiCache", "CloudShell"],
  "CloudTrail is the API-activity audit service. X-Ray traces request execution and CloudWatch handles metrics/logs.",
);
q(
  "6-monitor",
  "Which tool traces a request end to end across components?",
  "X-Ray",
  ["AWS Config", "A bucket ACL", "An LSI"],
  "X-Ray traces distributed request paths. Config assesses resource configuration.",
);
q(
  "6-monitor",
  "CacheMissCount rises. What does this indicate?",
  "More requests are served by the backend rather than the cache",
  [
    "Every request is forbidden",
    "API credentials expired",
    "All responses are compressed",
  ],
  "A cache miss requires backend service; a hit uses a cached response.",
);
q(
  "6-monitor",
  "Two users receive different responses for the same path. What is essential before caching?",
  "A cache-key and access design that separates the responses appropriately",
  [
    "Use one shared cache key for everyone",
    "Disable all authorizers",
    "Replace HTTPS with HTTP",
  ],
  "Cache keys must account for relevant response variations to prevent incorrect or private data reuse.",
  "Hard",
);
q(
  "6-lab",
  "In the supplied Module 6 lab, do the mock product endpoints already query DynamoDB live?",
  "No, real integration comes later",
  [
    "Yes, all mocks execute database queries",
    "Only when the browser is private",
    "Only when CORS is disabled",
  ],
  "The lab tests the website/API contract with mock responses; a later lab implements the live backend.",
);
textQ(
  "6-monitor",
  "Which metric measures backend request/response time?",
  ["IntegrationLatency"],
  "IntegrationLatency excludes the wider API Gateway processing interval measured by Latency.",
);
textQ(
  "6-stage",
  "Explain a one-API design for separate dev and prod Lambda aliases.",
  [
    "Deploy dev and prod stages and use stage variables with different alias values in the Lambda integration. Each stage URL selects the relevant environment.",
  ],
  "Self-assess: one API, two stages, stage-variable alias selection and separate invocation URLs.",
  "short",
);
textQ(
  "6-cors",
  "Why should an API still authorize requests after CORS is configured?",
  [
    "CORS only controls browser cross-origin access. It does not establish caller identity or block non-browser clients, so authentication and authorization remain necessary.",
  ],
  "Self-assess: browser enforcement and caller permissions are separate concerns.",
  "short",
);
q(
  "1-cafe",
  "Which café employee is introduced with visual design skills and an interest in learning cloud computing?",
  "Nikhil",
  ["Martha", "Mateo", "Olivia"],
  "Nikhil contributes design; Martha has accounting experience, Mateo is a systems consultant and Olivia is an architect.",
  "Easy",
);
q(
  "1-roles",
  "Which role most directly writes, tests and fixes application code?",
  "Developer",
  [
    "IT leader focused on budgeting",
    "Café co-owner focused on baking",
    "A certification exam",
  ],
  "The developer role focuses on application-level code and APIs/SDKs.",
  "Easy",
);
q(
  "2-sdlc",
  "Why does the software delivery challenge include reliability, security and speed together?",
  "New features must reach users without sacrificing stable, secure operations",
  [
    "Speed makes testing unnecessary",
    "Reliability prevents all future feature changes",
    "Security is only a post-deployment concern",
  ],
  "The lecture describes bridging stable operations and rapid development, rather than maximizing only one dimension.",
);
q(
  "2-config",
  "Which error-response field helps AWS identify a particular failed request during investigation?",
  "RequestId",
  ["The browser’s font size", "The Git branch name", "The IDE theme"],
  "The error structure includes a request identifier, error code, message and resource.",
);
q(
  "2-q",
  "Which Q Developer capability addresses vulnerabilities before release?",
  "Code security scanning and remediation suggestions",
  [
    "Automatically granting administrator access",
    "Replacing IAM entirely",
    "Making all test failures disappear",
  ],
  "The lecture describes scanning code for security vulnerabilities and suggesting remediations; developers still review results.",
);
q(
  "3-security",
  "Client-side encryption occurs at which point?",
  "Before data is transmitted to S3",
  [
    "Only after S3 decrypts a download",
    "Only after the bucket is deleted",
    "Only inside CloudWatch logs",
  ],
  "Client-side encryption protects data before upload. Server-side encryption is performed by the service on stored data.",
);
q(
  "3-version",
  "Which feature adds retention controls beyond merely keeping multiple object versions?",
  "S3 Object Lock",
  ["A filename extension", "An object prefix", "A GET byte range"],
  "The versioning slide identifies Object Lock support; retention controls constrain deletion beyond keeping versions.",
);
q(
  "3-objects",
  "Why set Content-Type to text/css when uploading core.css?",
  "To describe the representation so clients handle it as CSS",
  [
    "To grant public read access",
    "To enable versioning",
    "To change the bucket’s Region",
  ],
  "Content-Type is metadata about the representation; access control and versioning are separate settings.",
);
q(
  "4-policy",
  "Which field in a resource-based policy identifies who may make a request?",
  "Principal",
  ["Version", "Sid", "Content-Type"],
  "Principal identifies the requester covered by a resource policy; the other fields do not identify the caller.",
);
q(
  "4-roles",
  "A temporary contractor needs limited cross-account access. Which pattern best matches the lecture?",
  "Assume a trusted role with scoped permissions",
  [
    "Share the account root password",
    "Bake a permanent key into a public repository",
    "Make every resource public",
  ],
  "A role supplies temporary, delegated access with a defined trust relationship and permission scope.",
);
q(
  "5-crud",
  "Which key values must GetItem receive for a composite-key table?",
  "Both partition key and sort key",
  [
    "Only the partition key",
    "Only any non-key attribute",
    "Only the table’s creation date",
  ],
  "GetItem identifies one item by its complete primary key; Query can retrieve a collection sharing a partition key.",
);
q(
  "5-consistency",
  "If one operation fails in a DynamoDB transaction, what is the transaction outcome?",
  "The entire transaction fails",
  [
    "All other operations necessarily commit",
    "Only the largest item is skipped",
    "The table automatically switches to on-demand mode",
  ],
  "Transactions coordinate all-or-nothing changes, unlike partially successful batch operations.",
);
q(
  "5-crud",
  "What can UpdateItem do when the item does not yet exist, absent a preventing condition?",
  "Create a new item",
  [
    "Always fail because only PutItem can create items",
    "Create a new table automatically",
    "Change the key schema",
  ],
  "The lecture explicitly notes that UpdateItem may add a missing item; use conditions when creation is inappropriate.",
);
q(
  "5-query",
  "What is the per-request data boundary that requires Query or Scan pagination in the lecture?",
  "1 MB",
  ["1 KB", "5 GB", "50 TB"],
  "A request processes a bounded page; use continuation keys for further data. Returned data can be smaller after filtering.",
);
q(
  "5-backup",
  "Which recovery action produces a new table instead of undoing changes in the original table in place?",
  "Restoring from a backup or PITR",
  [
    "Adding a FilterExpression",
    "Changing a GSI projection",
    "Reading a stream shard",
  ],
  "Recovery creates a restored table that must be verified before an application cutover.",
);
q(
  "6-api",
  "Why does placing an API in front of a backend help independent client development?",
  "Clients depend on an exposed contract rather than backend implementation details",
  [
    "It removes the need for any error handling",
    "It makes every database public",
    "It guarantees all requests have identical payloads",
  ],
  "The API abstracts implementation details while defining communication between provider and user.",
);
q(
  "6-protect",
  "A gateway-generated client certificate primarily lets which component verify which caller?",
  "The backend verifies requests from API Gateway",
  [
    "The user verifies a DynamoDB sort key",
    "The browser verifies an IAM group",
    "S3 verifies a CSS filename",
  ],
  "The lecture separates backend verification using client certificates from end-user authorization.",
);
q(
  "6-monitor",
  "Which service assesses and audits resource configuration changes?",
  "AWS Config",
  ["CloudShell", "A usage plan", "Amazon Q’s inline autocomplete"],
  "The monitoring comparison assigns configuration assessment to AWS Config, API auditing to CloudTrail and tracing to X-Ray.",
);
q(
  "6-monitor",
  "What does minimumCompressionSize control?",
  "The payload size threshold for applying compression",
  [
    "The minimum allowed database key length",
    "The minimum API stage age",
    "The number of Lambda authorizers",
  ],
  "Compression is applied based on a size threshold and supported content coding; measure whether it improves performance.",
);
textQ(
  "6-mapping",
  "Name two reasons to transform a request at API Gateway.",
  [
    "Adapt field names/structure to the backend contract and remove or combine unnecessary fields, reducing changes required in client or backend applications.",
  ],
  "Self-assess: name concrete schema adaptation operations, such as combining names and mapping cellphone to mobilePhone.",
  "short",
);
export const lectureQuestions = generated;
export const questions: Question[] = [...originalCards, ...generated];
export const topicById = Object.fromEntries(
  modules.flatMap((m) => m.topics.map((t) => [t.id, t])),
);
