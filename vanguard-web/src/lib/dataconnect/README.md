# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `default`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListEngagements*](#listengagements)
  - [*GetEngagementDetails*](#getengagementdetails)
  - [*SearchKnowledgeBase*](#searchknowledgebase)
  - [*GetKnowledgeItem*](#getknowledgeitem)
- [**Mutations**](#mutations)
  - [*CreateEngagement*](#createengagement)
  - [*UpdateEngagementStatus*](#updateengagementstatus)
  - [*CreateArtifact*](#createartifact)
  - [*CreateInsight*](#createinsight)
  - [*MarkInsightPromoted*](#markinsightpromoted)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `default`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@vanguard/dataconnect` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@vanguard/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@vanguard/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `default` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListEngagements
You can execute the `ListEngagements` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listEngagements(vars: ListEngagementsVariables, options?: ExecuteQueryOptions): QueryPromise<ListEngagementsData, ListEngagementsVariables>;

interface ListEngagementsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListEngagementsVariables): QueryRef<ListEngagementsData, ListEngagementsVariables>;
}
export const listEngagementsRef: ListEngagementsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listEngagements(dc: DataConnect, vars: ListEngagementsVariables, options?: ExecuteQueryOptions): QueryPromise<ListEngagementsData, ListEngagementsVariables>;

interface ListEngagementsRef {
  ...
  (dc: DataConnect, vars: ListEngagementsVariables): QueryRef<ListEngagementsData, ListEngagementsVariables>;
}
export const listEngagementsRef: ListEngagementsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listEngagementsRef:
```typescript
const name = listEngagementsRef.operationName;
console.log(name);
```

### Variables
The `ListEngagements` query requires an argument of type `ListEngagementsVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListEngagementsVariables {
  teamId: UUIDString;
}
```
### Return Type
Recall that executing the `ListEngagements` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListEngagementsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListEngagementsData {
  engagements: ({
    id: UUIDString;
    type: EngagementType;
    status: EngagementStatus;
    customerName: string;
    title?: string | null;
    createdAt: TimestampString;
    user: {
      uid: string;
      displayName: string;
    } & User_Key;
  } & Engagement_Key)[];
}
```
### Using `ListEngagements`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listEngagements, ListEngagementsVariables } from '@vanguard/dataconnect';

// The `ListEngagements` query requires an argument of type `ListEngagementsVariables`:
const listEngagementsVars: ListEngagementsVariables = {
  teamId: ..., 
};

// Call the `listEngagements()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listEngagements(listEngagementsVars);
// Variables can be defined inline as well.
const { data } = await listEngagements({ teamId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listEngagements(dataConnect, listEngagementsVars);

console.log(data.engagements);

// Or, you can use the `Promise` API.
listEngagements(listEngagementsVars).then((response) => {
  const data = response.data;
  console.log(data.engagements);
});
```

### Using `ListEngagements`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listEngagementsRef, ListEngagementsVariables } from '@vanguard/dataconnect';

// The `ListEngagements` query requires an argument of type `ListEngagementsVariables`:
const listEngagementsVars: ListEngagementsVariables = {
  teamId: ..., 
};

// Call the `listEngagementsRef()` function to get a reference to the query.
const ref = listEngagementsRef(listEngagementsVars);
// Variables can be defined inline as well.
const ref = listEngagementsRef({ teamId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listEngagementsRef(dataConnect, listEngagementsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.engagements);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.engagements);
});
```

## GetEngagementDetails
You can execute the `GetEngagementDetails` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getEngagementDetails(vars: GetEngagementDetailsVariables, options?: ExecuteQueryOptions): QueryPromise<GetEngagementDetailsData, GetEngagementDetailsVariables>;

interface GetEngagementDetailsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetEngagementDetailsVariables): QueryRef<GetEngagementDetailsData, GetEngagementDetailsVariables>;
}
export const getEngagementDetailsRef: GetEngagementDetailsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getEngagementDetails(dc: DataConnect, vars: GetEngagementDetailsVariables, options?: ExecuteQueryOptions): QueryPromise<GetEngagementDetailsData, GetEngagementDetailsVariables>;

interface GetEngagementDetailsRef {
  ...
  (dc: DataConnect, vars: GetEngagementDetailsVariables): QueryRef<GetEngagementDetailsData, GetEngagementDetailsVariables>;
}
export const getEngagementDetailsRef: GetEngagementDetailsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getEngagementDetailsRef:
```typescript
const name = getEngagementDetailsRef.operationName;
console.log(name);
```

### Variables
The `GetEngagementDetails` query requires an argument of type `GetEngagementDetailsVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetEngagementDetailsVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetEngagementDetails` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetEngagementDetailsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetEngagementDetailsData {
  engagement?: {
    id: UUIDString;
    type: EngagementType;
    status: EngagementStatus;
    customerName: string;
    title?: string | null;
    context?: string | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
    user: {
      uid: string;
      displayName: string;
    } & User_Key;
    artifacts_on_engagement: ({
      id: UUIDString;
      type: ArtifactType;
      storageUrl: string;
      fileName: string;
      fileSizeBytes?: Int64String | null;
      createdAt: TimestampString;
    } & Artifact_Key)[];
    insights_on_engagement: ({
      id: UUIDString;
      dimension: InsightDimension;
      content: string;
      confidence?: number | null;
      isPromoted?: boolean | null;
      createdAt: TimestampString;
    } & Insight_Key)[];
  } & Engagement_Key;
}
```
### Using `GetEngagementDetails`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getEngagementDetails, GetEngagementDetailsVariables } from '@vanguard/dataconnect';

// The `GetEngagementDetails` query requires an argument of type `GetEngagementDetailsVariables`:
const getEngagementDetailsVars: GetEngagementDetailsVariables = {
  id: ..., 
};

// Call the `getEngagementDetails()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getEngagementDetails(getEngagementDetailsVars);
// Variables can be defined inline as well.
const { data } = await getEngagementDetails({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getEngagementDetails(dataConnect, getEngagementDetailsVars);

console.log(data.engagement);

// Or, you can use the `Promise` API.
getEngagementDetails(getEngagementDetailsVars).then((response) => {
  const data = response.data;
  console.log(data.engagement);
});
```

### Using `GetEngagementDetails`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getEngagementDetailsRef, GetEngagementDetailsVariables } from '@vanguard/dataconnect';

// The `GetEngagementDetails` query requires an argument of type `GetEngagementDetailsVariables`:
const getEngagementDetailsVars: GetEngagementDetailsVariables = {
  id: ..., 
};

// Call the `getEngagementDetailsRef()` function to get a reference to the query.
const ref = getEngagementDetailsRef(getEngagementDetailsVars);
// Variables can be defined inline as well.
const ref = getEngagementDetailsRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getEngagementDetailsRef(dataConnect, getEngagementDetailsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.engagement);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.engagement);
});
```

## SearchKnowledgeBase
You can execute the `SearchKnowledgeBase` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
searchKnowledgeBase(vars: SearchKnowledgeBaseVariables, options?: ExecuteQueryOptions): QueryPromise<SearchKnowledgeBaseData, SearchKnowledgeBaseVariables>;

interface SearchKnowledgeBaseRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: SearchKnowledgeBaseVariables): QueryRef<SearchKnowledgeBaseData, SearchKnowledgeBaseVariables>;
}
export const searchKnowledgeBaseRef: SearchKnowledgeBaseRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
searchKnowledgeBase(dc: DataConnect, vars: SearchKnowledgeBaseVariables, options?: ExecuteQueryOptions): QueryPromise<SearchKnowledgeBaseData, SearchKnowledgeBaseVariables>;

interface SearchKnowledgeBaseRef {
  ...
  (dc: DataConnect, vars: SearchKnowledgeBaseVariables): QueryRef<SearchKnowledgeBaseData, SearchKnowledgeBaseVariables>;
}
export const searchKnowledgeBaseRef: SearchKnowledgeBaseRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the searchKnowledgeBaseRef:
```typescript
const name = searchKnowledgeBaseRef.operationName;
console.log(name);
```

### Variables
The `SearchKnowledgeBase` query requires an argument of type `SearchKnowledgeBaseVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface SearchKnowledgeBaseVariables {
  query: string;
  teamId: UUIDString;
}
```
### Return Type
Recall that executing the `SearchKnowledgeBase` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `SearchKnowledgeBaseData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface SearchKnowledgeBaseData {
  knowledgeItems_search: ({
    id: UUIDString;
    title: string;
    summary: string;
    category: KnowledgeCategory;
    confidence?: number | null;
    createdAt: TimestampString;
  } & KnowledgeItem_Key)[];
}
```
### Using `SearchKnowledgeBase`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, searchKnowledgeBase, SearchKnowledgeBaseVariables } from '@vanguard/dataconnect';

// The `SearchKnowledgeBase` query requires an argument of type `SearchKnowledgeBaseVariables`:
const searchKnowledgeBaseVars: SearchKnowledgeBaseVariables = {
  query: ..., 
  teamId: ..., 
};

// Call the `searchKnowledgeBase()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await searchKnowledgeBase(searchKnowledgeBaseVars);
// Variables can be defined inline as well.
const { data } = await searchKnowledgeBase({ query: ..., teamId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await searchKnowledgeBase(dataConnect, searchKnowledgeBaseVars);

console.log(data.knowledgeItems_search);

// Or, you can use the `Promise` API.
searchKnowledgeBase(searchKnowledgeBaseVars).then((response) => {
  const data = response.data;
  console.log(data.knowledgeItems_search);
});
```

### Using `SearchKnowledgeBase`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, searchKnowledgeBaseRef, SearchKnowledgeBaseVariables } from '@vanguard/dataconnect';

// The `SearchKnowledgeBase` query requires an argument of type `SearchKnowledgeBaseVariables`:
const searchKnowledgeBaseVars: SearchKnowledgeBaseVariables = {
  query: ..., 
  teamId: ..., 
};

// Call the `searchKnowledgeBaseRef()` function to get a reference to the query.
const ref = searchKnowledgeBaseRef(searchKnowledgeBaseVars);
// Variables can be defined inline as well.
const ref = searchKnowledgeBaseRef({ query: ..., teamId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = searchKnowledgeBaseRef(dataConnect, searchKnowledgeBaseVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.knowledgeItems_search);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.knowledgeItems_search);
});
```

## GetKnowledgeItem
You can execute the `GetKnowledgeItem` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getKnowledgeItem(vars: GetKnowledgeItemVariables, options?: ExecuteQueryOptions): QueryPromise<GetKnowledgeItemData, GetKnowledgeItemVariables>;

interface GetKnowledgeItemRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetKnowledgeItemVariables): QueryRef<GetKnowledgeItemData, GetKnowledgeItemVariables>;
}
export const getKnowledgeItemRef: GetKnowledgeItemRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getKnowledgeItem(dc: DataConnect, vars: GetKnowledgeItemVariables, options?: ExecuteQueryOptions): QueryPromise<GetKnowledgeItemData, GetKnowledgeItemVariables>;

interface GetKnowledgeItemRef {
  ...
  (dc: DataConnect, vars: GetKnowledgeItemVariables): QueryRef<GetKnowledgeItemData, GetKnowledgeItemVariables>;
}
export const getKnowledgeItemRef: GetKnowledgeItemRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getKnowledgeItemRef:
```typescript
const name = getKnowledgeItemRef.operationName;
console.log(name);
```

### Variables
The `GetKnowledgeItem` query requires an argument of type `GetKnowledgeItemVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetKnowledgeItemVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetKnowledgeItem` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetKnowledgeItemData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetKnowledgeItemData {
  knowledgeItem?: {
    id: UUIDString;
    title: string;
    summary: string;
    keywords: string[];
    category: KnowledgeCategory;
    content: string;
    source?: string | null;
    confidence?: number | null;
    createdAt: TimestampString;
  } & KnowledgeItem_Key;
}
```
### Using `GetKnowledgeItem`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getKnowledgeItem, GetKnowledgeItemVariables } from '@vanguard/dataconnect';

// The `GetKnowledgeItem` query requires an argument of type `GetKnowledgeItemVariables`:
const getKnowledgeItemVars: GetKnowledgeItemVariables = {
  id: ..., 
};

// Call the `getKnowledgeItem()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getKnowledgeItem(getKnowledgeItemVars);
// Variables can be defined inline as well.
const { data } = await getKnowledgeItem({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getKnowledgeItem(dataConnect, getKnowledgeItemVars);

console.log(data.knowledgeItem);

// Or, you can use the `Promise` API.
getKnowledgeItem(getKnowledgeItemVars).then((response) => {
  const data = response.data;
  console.log(data.knowledgeItem);
});
```

### Using `GetKnowledgeItem`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getKnowledgeItemRef, GetKnowledgeItemVariables } from '@vanguard/dataconnect';

// The `GetKnowledgeItem` query requires an argument of type `GetKnowledgeItemVariables`:
const getKnowledgeItemVars: GetKnowledgeItemVariables = {
  id: ..., 
};

// Call the `getKnowledgeItemRef()` function to get a reference to the query.
const ref = getKnowledgeItemRef(getKnowledgeItemVars);
// Variables can be defined inline as well.
const ref = getKnowledgeItemRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getKnowledgeItemRef(dataConnect, getKnowledgeItemVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.knowledgeItem);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.knowledgeItem);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `default` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateEngagement
You can execute the `CreateEngagement` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createEngagement(vars: CreateEngagementVariables): MutationPromise<CreateEngagementData, CreateEngagementVariables>;

interface CreateEngagementRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateEngagementVariables): MutationRef<CreateEngagementData, CreateEngagementVariables>;
}
export const createEngagementRef: CreateEngagementRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createEngagement(dc: DataConnect, vars: CreateEngagementVariables): MutationPromise<CreateEngagementData, CreateEngagementVariables>;

interface CreateEngagementRef {
  ...
  (dc: DataConnect, vars: CreateEngagementVariables): MutationRef<CreateEngagementData, CreateEngagementVariables>;
}
export const createEngagementRef: CreateEngagementRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createEngagementRef:
```typescript
const name = createEngagementRef.operationName;
console.log(name);
```

### Variables
The `CreateEngagement` mutation requires an argument of type `CreateEngagementVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateEngagementVariables {
  teamId: UUIDString;
  type?: EngagementType | null;
  customerName: string;
  title?: string | null;
  context?: string | null;
}
```
### Return Type
Recall that executing the `CreateEngagement` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateEngagementData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateEngagementData {
  engagement_insert: Engagement_Key;
}
```
### Using `CreateEngagement`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createEngagement, CreateEngagementVariables } from '@vanguard/dataconnect';

// The `CreateEngagement` mutation requires an argument of type `CreateEngagementVariables`:
const createEngagementVars: CreateEngagementVariables = {
  teamId: ..., 
  type: ..., // optional
  customerName: ..., 
  title: ..., // optional
  context: ..., // optional
};

// Call the `createEngagement()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createEngagement(createEngagementVars);
// Variables can be defined inline as well.
const { data } = await createEngagement({ teamId: ..., type: ..., customerName: ..., title: ..., context: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createEngagement(dataConnect, createEngagementVars);

console.log(data.engagement_insert);

// Or, you can use the `Promise` API.
createEngagement(createEngagementVars).then((response) => {
  const data = response.data;
  console.log(data.engagement_insert);
});
```

### Using `CreateEngagement`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createEngagementRef, CreateEngagementVariables } from '@vanguard/dataconnect';

// The `CreateEngagement` mutation requires an argument of type `CreateEngagementVariables`:
const createEngagementVars: CreateEngagementVariables = {
  teamId: ..., 
  type: ..., // optional
  customerName: ..., 
  title: ..., // optional
  context: ..., // optional
};

// Call the `createEngagementRef()` function to get a reference to the mutation.
const ref = createEngagementRef(createEngagementVars);
// Variables can be defined inline as well.
const ref = createEngagementRef({ teamId: ..., type: ..., customerName: ..., title: ..., context: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createEngagementRef(dataConnect, createEngagementVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.engagement_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.engagement_insert);
});
```

## UpdateEngagementStatus
You can execute the `UpdateEngagementStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateEngagementStatus(vars: UpdateEngagementStatusVariables): MutationPromise<UpdateEngagementStatusData, UpdateEngagementStatusVariables>;

interface UpdateEngagementStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateEngagementStatusVariables): MutationRef<UpdateEngagementStatusData, UpdateEngagementStatusVariables>;
}
export const updateEngagementStatusRef: UpdateEngagementStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateEngagementStatus(dc: DataConnect, vars: UpdateEngagementStatusVariables): MutationPromise<UpdateEngagementStatusData, UpdateEngagementStatusVariables>;

interface UpdateEngagementStatusRef {
  ...
  (dc: DataConnect, vars: UpdateEngagementStatusVariables): MutationRef<UpdateEngagementStatusData, UpdateEngagementStatusVariables>;
}
export const updateEngagementStatusRef: UpdateEngagementStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateEngagementStatusRef:
```typescript
const name = updateEngagementStatusRef.operationName;
console.log(name);
```

### Variables
The `UpdateEngagementStatus` mutation requires an argument of type `UpdateEngagementStatusVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateEngagementStatusVariables {
  id: UUIDString;
  status: EngagementStatus;
}
```
### Return Type
Recall that executing the `UpdateEngagementStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateEngagementStatusData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateEngagementStatusData {
  engagement_update?: Engagement_Key | null;
}
```
### Using `UpdateEngagementStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateEngagementStatus, UpdateEngagementStatusVariables } from '@vanguard/dataconnect';

// The `UpdateEngagementStatus` mutation requires an argument of type `UpdateEngagementStatusVariables`:
const updateEngagementStatusVars: UpdateEngagementStatusVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateEngagementStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateEngagementStatus(updateEngagementStatusVars);
// Variables can be defined inline as well.
const { data } = await updateEngagementStatus({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateEngagementStatus(dataConnect, updateEngagementStatusVars);

console.log(data.engagement_update);

// Or, you can use the `Promise` API.
updateEngagementStatus(updateEngagementStatusVars).then((response) => {
  const data = response.data;
  console.log(data.engagement_update);
});
```

### Using `UpdateEngagementStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateEngagementStatusRef, UpdateEngagementStatusVariables } from '@vanguard/dataconnect';

// The `UpdateEngagementStatus` mutation requires an argument of type `UpdateEngagementStatusVariables`:
const updateEngagementStatusVars: UpdateEngagementStatusVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateEngagementStatusRef()` function to get a reference to the mutation.
const ref = updateEngagementStatusRef(updateEngagementStatusVars);
// Variables can be defined inline as well.
const ref = updateEngagementStatusRef({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateEngagementStatusRef(dataConnect, updateEngagementStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.engagement_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.engagement_update);
});
```

## CreateArtifact
You can execute the `CreateArtifact` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createArtifact(vars: CreateArtifactVariables): MutationPromise<CreateArtifactData, CreateArtifactVariables>;

interface CreateArtifactRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateArtifactVariables): MutationRef<CreateArtifactData, CreateArtifactVariables>;
}
export const createArtifactRef: CreateArtifactRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createArtifact(dc: DataConnect, vars: CreateArtifactVariables): MutationPromise<CreateArtifactData, CreateArtifactVariables>;

interface CreateArtifactRef {
  ...
  (dc: DataConnect, vars: CreateArtifactVariables): MutationRef<CreateArtifactData, CreateArtifactVariables>;
}
export const createArtifactRef: CreateArtifactRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createArtifactRef:
```typescript
const name = createArtifactRef.operationName;
console.log(name);
```

### Variables
The `CreateArtifact` mutation requires an argument of type `CreateArtifactVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateArtifactVariables {
  engagementId: UUIDString;
  type: ArtifactType;
  storageUrl: string;
  fileName: string;
  fileSizeBytes?: Int64String | null;
}
```
### Return Type
Recall that executing the `CreateArtifact` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateArtifactData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateArtifactData {
  artifact_insert: Artifact_Key;
}
```
### Using `CreateArtifact`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createArtifact, CreateArtifactVariables } from '@vanguard/dataconnect';

// The `CreateArtifact` mutation requires an argument of type `CreateArtifactVariables`:
const createArtifactVars: CreateArtifactVariables = {
  engagementId: ..., 
  type: ..., 
  storageUrl: ..., 
  fileName: ..., 
  fileSizeBytes: ..., // optional
};

// Call the `createArtifact()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createArtifact(createArtifactVars);
// Variables can be defined inline as well.
const { data } = await createArtifact({ engagementId: ..., type: ..., storageUrl: ..., fileName: ..., fileSizeBytes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createArtifact(dataConnect, createArtifactVars);

console.log(data.artifact_insert);

// Or, you can use the `Promise` API.
createArtifact(createArtifactVars).then((response) => {
  const data = response.data;
  console.log(data.artifact_insert);
});
```

### Using `CreateArtifact`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createArtifactRef, CreateArtifactVariables } from '@vanguard/dataconnect';

// The `CreateArtifact` mutation requires an argument of type `CreateArtifactVariables`:
const createArtifactVars: CreateArtifactVariables = {
  engagementId: ..., 
  type: ..., 
  storageUrl: ..., 
  fileName: ..., 
  fileSizeBytes: ..., // optional
};

// Call the `createArtifactRef()` function to get a reference to the mutation.
const ref = createArtifactRef(createArtifactVars);
// Variables can be defined inline as well.
const ref = createArtifactRef({ engagementId: ..., type: ..., storageUrl: ..., fileName: ..., fileSizeBytes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createArtifactRef(dataConnect, createArtifactVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.artifact_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.artifact_insert);
});
```

## CreateInsight
You can execute the `CreateInsight` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createInsight(vars: CreateInsightVariables): MutationPromise<CreateInsightData, CreateInsightVariables>;

interface CreateInsightRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateInsightVariables): MutationRef<CreateInsightData, CreateInsightVariables>;
}
export const createInsightRef: CreateInsightRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createInsight(dc: DataConnect, vars: CreateInsightVariables): MutationPromise<CreateInsightData, CreateInsightVariables>;

interface CreateInsightRef {
  ...
  (dc: DataConnect, vars: CreateInsightVariables): MutationRef<CreateInsightData, CreateInsightVariables>;
}
export const createInsightRef: CreateInsightRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createInsightRef:
```typescript
const name = createInsightRef.operationName;
console.log(name);
```

### Variables
The `CreateInsight` mutation requires an argument of type `CreateInsightVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateInsightVariables {
  engagementId: UUIDString;
  dimension: InsightDimension;
  content: string;
  confidence?: number | null;
}
```
### Return Type
Recall that executing the `CreateInsight` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateInsightData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateInsightData {
  insight_insert: Insight_Key;
}
```
### Using `CreateInsight`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createInsight, CreateInsightVariables } from '@vanguard/dataconnect';

// The `CreateInsight` mutation requires an argument of type `CreateInsightVariables`:
const createInsightVars: CreateInsightVariables = {
  engagementId: ..., 
  dimension: ..., 
  content: ..., 
  confidence: ..., // optional
};

// Call the `createInsight()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createInsight(createInsightVars);
// Variables can be defined inline as well.
const { data } = await createInsight({ engagementId: ..., dimension: ..., content: ..., confidence: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createInsight(dataConnect, createInsightVars);

console.log(data.insight_insert);

// Or, you can use the `Promise` API.
createInsight(createInsightVars).then((response) => {
  const data = response.data;
  console.log(data.insight_insert);
});
```

### Using `CreateInsight`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createInsightRef, CreateInsightVariables } from '@vanguard/dataconnect';

// The `CreateInsight` mutation requires an argument of type `CreateInsightVariables`:
const createInsightVars: CreateInsightVariables = {
  engagementId: ..., 
  dimension: ..., 
  content: ..., 
  confidence: ..., // optional
};

// Call the `createInsightRef()` function to get a reference to the mutation.
const ref = createInsightRef(createInsightVars);
// Variables can be defined inline as well.
const ref = createInsightRef({ engagementId: ..., dimension: ..., content: ..., confidence: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createInsightRef(dataConnect, createInsightVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.insight_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.insight_insert);
});
```

## MarkInsightPromoted
You can execute the `MarkInsightPromoted` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
markInsightPromoted(vars: MarkInsightPromotedVariables): MutationPromise<MarkInsightPromotedData, MarkInsightPromotedVariables>;

interface MarkInsightPromotedRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: MarkInsightPromotedVariables): MutationRef<MarkInsightPromotedData, MarkInsightPromotedVariables>;
}
export const markInsightPromotedRef: MarkInsightPromotedRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
markInsightPromoted(dc: DataConnect, vars: MarkInsightPromotedVariables): MutationPromise<MarkInsightPromotedData, MarkInsightPromotedVariables>;

interface MarkInsightPromotedRef {
  ...
  (dc: DataConnect, vars: MarkInsightPromotedVariables): MutationRef<MarkInsightPromotedData, MarkInsightPromotedVariables>;
}
export const markInsightPromotedRef: MarkInsightPromotedRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the markInsightPromotedRef:
```typescript
const name = markInsightPromotedRef.operationName;
console.log(name);
```

### Variables
The `MarkInsightPromoted` mutation requires an argument of type `MarkInsightPromotedVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface MarkInsightPromotedVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `MarkInsightPromoted` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `MarkInsightPromotedData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface MarkInsightPromotedData {
  insight_update?: Insight_Key | null;
}
```
### Using `MarkInsightPromoted`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, markInsightPromoted, MarkInsightPromotedVariables } from '@vanguard/dataconnect';

// The `MarkInsightPromoted` mutation requires an argument of type `MarkInsightPromotedVariables`:
const markInsightPromotedVars: MarkInsightPromotedVariables = {
  id: ..., 
};

// Call the `markInsightPromoted()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await markInsightPromoted(markInsightPromotedVars);
// Variables can be defined inline as well.
const { data } = await markInsightPromoted({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await markInsightPromoted(dataConnect, markInsightPromotedVars);

console.log(data.insight_update);

// Or, you can use the `Promise` API.
markInsightPromoted(markInsightPromotedVars).then((response) => {
  const data = response.data;
  console.log(data.insight_update);
});
```

### Using `MarkInsightPromoted`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, markInsightPromotedRef, MarkInsightPromotedVariables } from '@vanguard/dataconnect';

// The `MarkInsightPromoted` mutation requires an argument of type `MarkInsightPromotedVariables`:
const markInsightPromotedVars: MarkInsightPromotedVariables = {
  id: ..., 
};

// Call the `markInsightPromotedRef()` function to get a reference to the mutation.
const ref = markInsightPromotedRef(markInsightPromotedVars);
// Variables can be defined inline as well.
const ref = markInsightPromotedRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = markInsightPromotedRef(dataConnect, markInsightPromotedVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.insight_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.insight_update);
});
```

