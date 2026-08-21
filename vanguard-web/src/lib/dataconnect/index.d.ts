import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;


export enum ArtifactType {
  AUDIO = "AUDIO",
  IMAGE = "IMAGE",
  LOG = "LOG",
  NOTE = "NOTE",
  DOCUMENT = "DOCUMENT",
};

export enum EngagementStatus {
  CREATED = "CREATED",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
};

export enum EngagementType {
  INTERVIEW = "INTERVIEW",
  INFRA_SURVEY = "INFRA_SURVEY",
  POC_TRACKING = "POC_TRACKING",
  TROUBLESHOOTING = "TROUBLESHOOTING",
  SOW_PROPOSAL = "SOW_PROPOSAL",
};

export enum InsightDimension {
  FUNCTIONAL = "FUNCTIONAL",
  PAIN_POINT = "PAIN_POINT",
  JOBS_TO_BE_DONE = "JOBS_TO_BE_DONE",
  LATENT_DESIRE = "LATENT_DESIRE",
  EMOTIONAL = "EMOTIONAL",
  SOCIAL = "SOCIAL",
  CONSTRAINT = "CONSTRAINT",
};

export enum KnowledgeCategory {
  INDUSTRY_BACKGROUND = "INDUSTRY_BACKGROUND",
  CUSTOMER_PATTERN = "CUSTOMER_PATTERN",
  COMPETITOR_INSIGHT = "COMPETITOR_INSIGHT",
  METHODOLOGY = "METHODOLOGY",
  CASE_STUDY = "CASE_STUDY",
};



export interface Artifact_Key {
  id: UUIDString;
  __typename?: 'Artifact_Key';
}

export interface CreateArtifactData {
  artifact_insert: Artifact_Key;
}

export interface CreateArtifactVariables {
  engagementId: UUIDString;
  type: ArtifactType;
  storageUrl: string;
  fileName: string;
  fileSizeBytes?: Int64String | null;
}

export interface CreateEngagementData {
  engagement_insert: Engagement_Key;
}

export interface CreateEngagementVariables {
  teamId: UUIDString;
  type?: EngagementType | null;
  customerName: string;
  title?: string | null;
  context?: string | null;
}

export interface CreateInsightData {
  insight_insert: Insight_Key;
}

export interface CreateInsightVariables {
  engagementId: UUIDString;
  dimension: InsightDimension;
  content: string;
  confidence?: number | null;
}

export interface Engagement_Key {
  id: UUIDString;
  __typename?: 'Engagement_Key';
}

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

export interface GetEngagementDetailsVariables {
  id: UUIDString;
}

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

export interface GetKnowledgeItemVariables {
  id: UUIDString;
}

export interface Insight_Key {
  id: UUIDString;
  __typename?: 'Insight_Key';
}

export interface KnowledgeItem_Key {
  id: UUIDString;
  __typename?: 'KnowledgeItem_Key';
}

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

export interface ListEngagementsVariables {
  teamId: UUIDString;
}

export interface MarkInsightPromotedData {
  insight_update?: Insight_Key | null;
}

export interface MarkInsightPromotedVariables {
  id: UUIDString;
}

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

export interface SearchKnowledgeBaseVariables {
  query: string;
  teamId: UUIDString;
}

export interface Team_Key {
  id: UUIDString;
  __typename?: 'Team_Key';
}

export interface TokenLog_Key {
  id: UUIDString;
  __typename?: 'TokenLog_Key';
}

export interface UpdateEngagementStatusData {
  engagement_update?: Engagement_Key | null;
}

export interface UpdateEngagementStatusVariables {
  id: UUIDString;
  status: EngagementStatus;
}

export interface User_Key {
  uid: string;
  __typename?: 'User_Key';
}

interface CreateEngagementRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateEngagementVariables): MutationRef<CreateEngagementData, CreateEngagementVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateEngagementVariables): MutationRef<CreateEngagementData, CreateEngagementVariables>;
  operationName: string;
}
export const createEngagementRef: CreateEngagementRef;

export function createEngagement(vars: CreateEngagementVariables): MutationPromise<CreateEngagementData, CreateEngagementVariables>;
export function createEngagement(dc: DataConnect, vars: CreateEngagementVariables): MutationPromise<CreateEngagementData, CreateEngagementVariables>;

interface UpdateEngagementStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateEngagementStatusVariables): MutationRef<UpdateEngagementStatusData, UpdateEngagementStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateEngagementStatusVariables): MutationRef<UpdateEngagementStatusData, UpdateEngagementStatusVariables>;
  operationName: string;
}
export const updateEngagementStatusRef: UpdateEngagementStatusRef;

export function updateEngagementStatus(vars: UpdateEngagementStatusVariables): MutationPromise<UpdateEngagementStatusData, UpdateEngagementStatusVariables>;
export function updateEngagementStatus(dc: DataConnect, vars: UpdateEngagementStatusVariables): MutationPromise<UpdateEngagementStatusData, UpdateEngagementStatusVariables>;

interface CreateArtifactRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateArtifactVariables): MutationRef<CreateArtifactData, CreateArtifactVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateArtifactVariables): MutationRef<CreateArtifactData, CreateArtifactVariables>;
  operationName: string;
}
export const createArtifactRef: CreateArtifactRef;

export function createArtifact(vars: CreateArtifactVariables): MutationPromise<CreateArtifactData, CreateArtifactVariables>;
export function createArtifact(dc: DataConnect, vars: CreateArtifactVariables): MutationPromise<CreateArtifactData, CreateArtifactVariables>;

interface CreateInsightRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateInsightVariables): MutationRef<CreateInsightData, CreateInsightVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateInsightVariables): MutationRef<CreateInsightData, CreateInsightVariables>;
  operationName: string;
}
export const createInsightRef: CreateInsightRef;

export function createInsight(vars: CreateInsightVariables): MutationPromise<CreateInsightData, CreateInsightVariables>;
export function createInsight(dc: DataConnect, vars: CreateInsightVariables): MutationPromise<CreateInsightData, CreateInsightVariables>;

interface MarkInsightPromotedRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: MarkInsightPromotedVariables): MutationRef<MarkInsightPromotedData, MarkInsightPromotedVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: MarkInsightPromotedVariables): MutationRef<MarkInsightPromotedData, MarkInsightPromotedVariables>;
  operationName: string;
}
export const markInsightPromotedRef: MarkInsightPromotedRef;

export function markInsightPromoted(vars: MarkInsightPromotedVariables): MutationPromise<MarkInsightPromotedData, MarkInsightPromotedVariables>;
export function markInsightPromoted(dc: DataConnect, vars: MarkInsightPromotedVariables): MutationPromise<MarkInsightPromotedData, MarkInsightPromotedVariables>;

interface ListEngagementsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListEngagementsVariables): QueryRef<ListEngagementsData, ListEngagementsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListEngagementsVariables): QueryRef<ListEngagementsData, ListEngagementsVariables>;
  operationName: string;
}
export const listEngagementsRef: ListEngagementsRef;

export function listEngagements(vars: ListEngagementsVariables, options?: ExecuteQueryOptions): QueryPromise<ListEngagementsData, ListEngagementsVariables>;
export function listEngagements(dc: DataConnect, vars: ListEngagementsVariables, options?: ExecuteQueryOptions): QueryPromise<ListEngagementsData, ListEngagementsVariables>;

interface GetEngagementDetailsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetEngagementDetailsVariables): QueryRef<GetEngagementDetailsData, GetEngagementDetailsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetEngagementDetailsVariables): QueryRef<GetEngagementDetailsData, GetEngagementDetailsVariables>;
  operationName: string;
}
export const getEngagementDetailsRef: GetEngagementDetailsRef;

export function getEngagementDetails(vars: GetEngagementDetailsVariables, options?: ExecuteQueryOptions): QueryPromise<GetEngagementDetailsData, GetEngagementDetailsVariables>;
export function getEngagementDetails(dc: DataConnect, vars: GetEngagementDetailsVariables, options?: ExecuteQueryOptions): QueryPromise<GetEngagementDetailsData, GetEngagementDetailsVariables>;

interface SearchKnowledgeBaseRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: SearchKnowledgeBaseVariables): QueryRef<SearchKnowledgeBaseData, SearchKnowledgeBaseVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: SearchKnowledgeBaseVariables): QueryRef<SearchKnowledgeBaseData, SearchKnowledgeBaseVariables>;
  operationName: string;
}
export const searchKnowledgeBaseRef: SearchKnowledgeBaseRef;

export function searchKnowledgeBase(vars: SearchKnowledgeBaseVariables, options?: ExecuteQueryOptions): QueryPromise<SearchKnowledgeBaseData, SearchKnowledgeBaseVariables>;
export function searchKnowledgeBase(dc: DataConnect, vars: SearchKnowledgeBaseVariables, options?: ExecuteQueryOptions): QueryPromise<SearchKnowledgeBaseData, SearchKnowledgeBaseVariables>;

interface GetKnowledgeItemRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetKnowledgeItemVariables): QueryRef<GetKnowledgeItemData, GetKnowledgeItemVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetKnowledgeItemVariables): QueryRef<GetKnowledgeItemData, GetKnowledgeItemVariables>;
  operationName: string;
}
export const getKnowledgeItemRef: GetKnowledgeItemRef;

export function getKnowledgeItem(vars: GetKnowledgeItemVariables, options?: ExecuteQueryOptions): QueryPromise<GetKnowledgeItemData, GetKnowledgeItemVariables>;
export function getKnowledgeItem(dc: DataConnect, vars: GetKnowledgeItemVariables, options?: ExecuteQueryOptions): QueryPromise<GetKnowledgeItemData, GetKnowledgeItemVariables>;

