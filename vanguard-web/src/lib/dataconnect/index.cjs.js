const { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const ArtifactType = {
  AUDIO: "AUDIO",
  IMAGE: "IMAGE",
  LOG: "LOG",
  NOTE: "NOTE",
  DOCUMENT: "DOCUMENT",
}
exports.ArtifactType = ArtifactType;

const EngagementStatus = {
  CREATED: "CREATED",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
}
exports.EngagementStatus = EngagementStatus;

const EngagementType = {
  INTERVIEW: "INTERVIEW",
  INFRA_SURVEY: "INFRA_SURVEY",
  POC_TRACKING: "POC_TRACKING",
  TROUBLESHOOTING: "TROUBLESHOOTING",
  SOW_PROPOSAL: "SOW_PROPOSAL",
}
exports.EngagementType = EngagementType;

const InsightDimension = {
  FUNCTIONAL: "FUNCTIONAL",
  PAIN_POINT: "PAIN_POINT",
  JOBS_TO_BE_DONE: "JOBS_TO_BE_DONE",
  LATENT_DESIRE: "LATENT_DESIRE",
  EMOTIONAL: "EMOTIONAL",
  SOCIAL: "SOCIAL",
  CONSTRAINT: "CONSTRAINT",
}
exports.InsightDimension = InsightDimension;

const KnowledgeCategory = {
  INDUSTRY_BACKGROUND: "INDUSTRY_BACKGROUND",
  CUSTOMER_PATTERN: "CUSTOMER_PATTERN",
  COMPETITOR_INSIGHT: "COMPETITOR_INSIGHT",
  METHODOLOGY: "METHODOLOGY",
  CASE_STUDY: "CASE_STUDY",
}
exports.KnowledgeCategory = KnowledgeCategory;

const connectorConfig = {
  connector: 'default',
  service: 'vanguard-data',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

const createEngagementRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateEngagement', inputVars);
}
createEngagementRef.operationName = 'CreateEngagement';
exports.createEngagementRef = createEngagementRef;

exports.createEngagement = function createEngagement(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createEngagementRef(dcInstance, inputVars));
}
;

const updateEngagementStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateEngagementStatus', inputVars);
}
updateEngagementStatusRef.operationName = 'UpdateEngagementStatus';
exports.updateEngagementStatusRef = updateEngagementStatusRef;

exports.updateEngagementStatus = function updateEngagementStatus(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateEngagementStatusRef(dcInstance, inputVars));
}
;

const createArtifactRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateArtifact', inputVars);
}
createArtifactRef.operationName = 'CreateArtifact';
exports.createArtifactRef = createArtifactRef;

exports.createArtifact = function createArtifact(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createArtifactRef(dcInstance, inputVars));
}
;

const createInsightRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateInsight', inputVars);
}
createInsightRef.operationName = 'CreateInsight';
exports.createInsightRef = createInsightRef;

exports.createInsight = function createInsight(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createInsightRef(dcInstance, inputVars));
}
;

const markInsightPromotedRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'MarkInsightPromoted', inputVars);
}
markInsightPromotedRef.operationName = 'MarkInsightPromoted';
exports.markInsightPromotedRef = markInsightPromotedRef;

exports.markInsightPromoted = function markInsightPromoted(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(markInsightPromotedRef(dcInstance, inputVars));
}
;

const listEngagementsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListEngagements', inputVars);
}
listEngagementsRef.operationName = 'ListEngagements';
exports.listEngagementsRef = listEngagementsRef;

exports.listEngagements = function listEngagements(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listEngagementsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getEngagementDetailsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetEngagementDetails', inputVars);
}
getEngagementDetailsRef.operationName = 'GetEngagementDetails';
exports.getEngagementDetailsRef = getEngagementDetailsRef;

exports.getEngagementDetails = function getEngagementDetails(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getEngagementDetailsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const searchKnowledgeBaseRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'SearchKnowledgeBase', inputVars);
}
searchKnowledgeBaseRef.operationName = 'SearchKnowledgeBase';
exports.searchKnowledgeBaseRef = searchKnowledgeBaseRef;

exports.searchKnowledgeBase = function searchKnowledgeBase(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(searchKnowledgeBaseRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getKnowledgeItemRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetKnowledgeItem', inputVars);
}
getKnowledgeItemRef.operationName = 'GetKnowledgeItem';
exports.getKnowledgeItemRef = getKnowledgeItemRef;

exports.getKnowledgeItem = function getKnowledgeItem(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getKnowledgeItemRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;
