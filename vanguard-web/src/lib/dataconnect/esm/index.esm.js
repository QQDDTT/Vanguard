import { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const ArtifactType = {
  AUDIO: "AUDIO",
  IMAGE: "IMAGE",
  LOG: "LOG",
  NOTE: "NOTE",
  DOCUMENT: "DOCUMENT",
}

export const EngagementStatus = {
  CREATED: "CREATED",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
}

export const EngagementType = {
  INTERVIEW: "INTERVIEW",
  INFRA_SURVEY: "INFRA_SURVEY",
  POC_TRACKING: "POC_TRACKING",
  TROUBLESHOOTING: "TROUBLESHOOTING",
  SOW_PROPOSAL: "SOW_PROPOSAL",
}

export const InsightDimension = {
  FUNCTIONAL: "FUNCTIONAL",
  PAIN_POINT: "PAIN_POINT",
  JOBS_TO_BE_DONE: "JOBS_TO_BE_DONE",
  LATENT_DESIRE: "LATENT_DESIRE",
  EMOTIONAL: "EMOTIONAL",
  SOCIAL: "SOCIAL",
  CONSTRAINT: "CONSTRAINT",
}

export const KnowledgeCategory = {
  INDUSTRY_BACKGROUND: "INDUSTRY_BACKGROUND",
  CUSTOMER_PATTERN: "CUSTOMER_PATTERN",
  COMPETITOR_INSIGHT: "COMPETITOR_INSIGHT",
  METHODOLOGY: "METHODOLOGY",
  CASE_STUDY: "CASE_STUDY",
}

export const connectorConfig = {
  connector: 'default',
  service: 'vanguard-data',
  location: 'us-central1'
};
export const createEngagementRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateEngagement', inputVars);
}
createEngagementRef.operationName = 'CreateEngagement';

export function createEngagement(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createEngagementRef(dcInstance, inputVars));
}

export const updateEngagementStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateEngagementStatus', inputVars);
}
updateEngagementStatusRef.operationName = 'UpdateEngagementStatus';

export function updateEngagementStatus(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateEngagementStatusRef(dcInstance, inputVars));
}

export const createArtifactRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateArtifact', inputVars);
}
createArtifactRef.operationName = 'CreateArtifact';

export function createArtifact(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createArtifactRef(dcInstance, inputVars));
}

export const createInsightRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateInsight', inputVars);
}
createInsightRef.operationName = 'CreateInsight';

export function createInsight(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createInsightRef(dcInstance, inputVars));
}

export const markInsightPromotedRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'MarkInsightPromoted', inputVars);
}
markInsightPromotedRef.operationName = 'MarkInsightPromoted';

export function markInsightPromoted(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(markInsightPromotedRef(dcInstance, inputVars));
}

export const listEngagementsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListEngagements', inputVars);
}
listEngagementsRef.operationName = 'ListEngagements';

export function listEngagements(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listEngagementsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

export const getEngagementDetailsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetEngagementDetails', inputVars);
}
getEngagementDetailsRef.operationName = 'GetEngagementDetails';

export function getEngagementDetails(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getEngagementDetailsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

export const searchKnowledgeBaseRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'SearchKnowledgeBase', inputVars);
}
searchKnowledgeBaseRef.operationName = 'SearchKnowledgeBase';

export function searchKnowledgeBase(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(searchKnowledgeBaseRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

export const getKnowledgeItemRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetKnowledgeItem', inputVars);
}
getKnowledgeItemRef.operationName = 'GetKnowledgeItem';

export function getKnowledgeItem(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getKnowledgeItemRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

