# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createEngagement, updateEngagementStatus, createArtifact, createInsight, markInsightPromoted, listEngagements, getEngagementDetails, searchKnowledgeBase, getKnowledgeItem } from '@vanguard/dataconnect';


// Operation CreateEngagement:  For variables, look at type CreateEngagementVars in ../index.d.ts
const { data } = await CreateEngagement(dataConnect, createEngagementVars);

// Operation UpdateEngagementStatus:  For variables, look at type UpdateEngagementStatusVars in ../index.d.ts
const { data } = await UpdateEngagementStatus(dataConnect, updateEngagementStatusVars);

// Operation CreateArtifact:  For variables, look at type CreateArtifactVars in ../index.d.ts
const { data } = await CreateArtifact(dataConnect, createArtifactVars);

// Operation CreateInsight:  For variables, look at type CreateInsightVars in ../index.d.ts
const { data } = await CreateInsight(dataConnect, createInsightVars);

// Operation MarkInsightPromoted:  For variables, look at type MarkInsightPromotedVars in ../index.d.ts
const { data } = await MarkInsightPromoted(dataConnect, markInsightPromotedVars);

// Operation ListEngagements:  For variables, look at type ListEngagementsVars in ../index.d.ts
const { data } = await ListEngagements(dataConnect, listEngagementsVars);

// Operation GetEngagementDetails:  For variables, look at type GetEngagementDetailsVars in ../index.d.ts
const { data } = await GetEngagementDetails(dataConnect, getEngagementDetailsVars);

// Operation SearchKnowledgeBase:  For variables, look at type SearchKnowledgeBaseVars in ../index.d.ts
const { data } = await SearchKnowledgeBase(dataConnect, searchKnowledgeBaseVars);

// Operation GetKnowledgeItem:  For variables, look at type GetKnowledgeItemVars in ../index.d.ts
const { data } = await GetKnowledgeItem(dataConnect, getKnowledgeItemVars);


```