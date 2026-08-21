
@file:Suppress(
  "KotlinRedundantDiagnosticSuppress",
  "PropertyName",
  "MayBeConstant",
  "RedundantVisibilityModifier",
  "RedundantCompanionReference",
  "RemoveEmptyClassBody",
  "SpellCheckingInspection",
  "unused",
)

package com.evotensor.vanguard.dataconnect

import com.google.firebase.dataconnect.getInstance as _fdcGetInstance
import kotlin.time.Duration.Companion.milliseconds as _milliseconds

public interface DefaultConnector : com.google.firebase.dataconnect.generated.GeneratedConnector<DefaultConnector> {
  override val dataConnect: com.google.firebase.dataconnect.FirebaseDataConnect

  
    public val createArtifact: CreateArtifactMutation
  
    public val createEngagement: CreateEngagementMutation
  
    public val createInsight: CreateInsightMutation
  
    public val getEngagementDetails: GetEngagementDetailsQuery
  
    public val getKnowledgeItem: GetKnowledgeItemQuery
  
    public val listEngagements: ListEngagementsQuery
  
    public val markInsightPromoted: MarkInsightPromotedMutation
  
    public val searchKnowledgeBase: SearchKnowledgeBaseQuery
  
    public val updateEngagementStatus: UpdateEngagementStatusMutation
  

  public companion object {
    @Suppress("MemberVisibilityCanBePrivate")
    public val config: com.google.firebase.dataconnect.ConnectorConfig = com.google.firebase.dataconnect.ConnectorConfig(
      connector = "default",
      location = "us-central1",
      serviceId = "vanguard-data",
    )

    public fun getInstance(
      dataConnect: com.google.firebase.dataconnect.FirebaseDataConnect
    ):DefaultConnector = synchronized(instances) {
      instances.getOrPut(dataConnect) {
        DefaultConnectorImpl(dataConnect)
      }
    }

    private val instances = java.util.WeakHashMap<com.google.firebase.dataconnect.FirebaseDataConnect, DefaultConnectorImpl>()

    
  }
}

public val DefaultConnector.Companion.instance:DefaultConnector
  get() = getInstance(com.google.firebase.dataconnect.FirebaseDataConnect._fdcGetInstance(
    config
  ))

public fun DefaultConnector.Companion.getInstance(
  settings: com.google.firebase.dataconnect.DataConnectSettings = com.google.firebase.dataconnect.DataConnectSettings()
):DefaultConnector =
  getInstance(com.google.firebase.dataconnect.FirebaseDataConnect._fdcGetInstance(config, settings))

public fun DefaultConnector.Companion.getInstance(
  app: com.google.firebase.FirebaseApp,
  settings: com.google.firebase.dataconnect.DataConnectSettings = com.google.firebase.dataconnect.DataConnectSettings()
):DefaultConnector =
  getInstance(com.google.firebase.dataconnect.FirebaseDataConnect._fdcGetInstance(app, config, settings))

private class DefaultConnectorImpl(
  override val dataConnect: com.google.firebase.dataconnect.FirebaseDataConnect
) : DefaultConnector {
  
    override val createArtifact by lazy(LazyThreadSafetyMode.PUBLICATION) {
      CreateArtifactMutationImpl(this)
    }
  
    override val createEngagement by lazy(LazyThreadSafetyMode.PUBLICATION) {
      CreateEngagementMutationImpl(this)
    }
  
    override val createInsight by lazy(LazyThreadSafetyMode.PUBLICATION) {
      CreateInsightMutationImpl(this)
    }
  
    override val getEngagementDetails by lazy(LazyThreadSafetyMode.PUBLICATION) {
      GetEngagementDetailsQueryImpl(this)
    }
  
    override val getKnowledgeItem by lazy(LazyThreadSafetyMode.PUBLICATION) {
      GetKnowledgeItemQueryImpl(this)
    }
  
    override val listEngagements by lazy(LazyThreadSafetyMode.PUBLICATION) {
      ListEngagementsQueryImpl(this)
    }
  
    override val markInsightPromoted by lazy(LazyThreadSafetyMode.PUBLICATION) {
      MarkInsightPromotedMutationImpl(this)
    }
  
    override val searchKnowledgeBase by lazy(LazyThreadSafetyMode.PUBLICATION) {
      SearchKnowledgeBaseQueryImpl(this)
    }
  
    override val updateEngagementStatus by lazy(LazyThreadSafetyMode.PUBLICATION) {
      UpdateEngagementStatusMutationImpl(this)
    }
  

  @com.google.firebase.dataconnect.ExperimentalFirebaseDataConnect
  override fun operations(): List<com.google.firebase.dataconnect.generated.GeneratedOperation<DefaultConnector, *, *>> =
    queries() + mutations()

  @com.google.firebase.dataconnect.ExperimentalFirebaseDataConnect
  override fun mutations(): List<com.google.firebase.dataconnect.generated.GeneratedMutation<DefaultConnector, *, *>> =
    listOf(
      createArtifact,
        createEngagement,
        createInsight,
        markInsightPromoted,
        updateEngagementStatus,
        
    )

  @com.google.firebase.dataconnect.ExperimentalFirebaseDataConnect
  override fun queries(): List<com.google.firebase.dataconnect.generated.GeneratedQuery<DefaultConnector, *, *>> =
    listOf(
      getEngagementDetails,
        getKnowledgeItem,
        listEngagements,
        searchKnowledgeBase,
        
    )

  @com.google.firebase.dataconnect.ExperimentalFirebaseDataConnect
  override fun copy(dataConnect: com.google.firebase.dataconnect.FirebaseDataConnect) =
    DefaultConnectorImpl(dataConnect)

  override fun equals(other: Any?): Boolean =
    other is DefaultConnectorImpl &&
    other.dataConnect == dataConnect

  override fun hashCode(): Int =
    java.util.Objects.hash(
      "DefaultConnectorImpl",
      dataConnect,
    )

  override fun toString(): String =
    "DefaultConnectorImpl(dataConnect=$dataConnect)"
}



private open class DefaultConnectorGeneratedQueryImpl<Data, Variables>(
  override val connector: DefaultConnector,
  override val operationName: String,
  override val dataDeserializer: kotlinx.serialization.DeserializationStrategy<Data>,
  override val variablesSerializer: kotlinx.serialization.SerializationStrategy<Variables>,
) : com.google.firebase.dataconnect.generated.GeneratedQuery<DefaultConnector, Data, Variables> {

  @com.google.firebase.dataconnect.ExperimentalFirebaseDataConnect
  override fun copy(
    connector: DefaultConnector,
    operationName: String,
    dataDeserializer: kotlinx.serialization.DeserializationStrategy<Data>,
    variablesSerializer: kotlinx.serialization.SerializationStrategy<Variables>,
  ) =
    DefaultConnectorGeneratedQueryImpl(
      connector, operationName, dataDeserializer, variablesSerializer
    )

  @com.google.firebase.dataconnect.ExperimentalFirebaseDataConnect
  override fun <NewVariables> withVariablesSerializer(
    variablesSerializer: kotlinx.serialization.SerializationStrategy<NewVariables>
  ) =
    DefaultConnectorGeneratedQueryImpl(
      connector, operationName, dataDeserializer, variablesSerializer
    )

  @com.google.firebase.dataconnect.ExperimentalFirebaseDataConnect
  override fun <NewData> withDataDeserializer(
    dataDeserializer: kotlinx.serialization.DeserializationStrategy<NewData>
  ) =
    DefaultConnectorGeneratedQueryImpl(
      connector, operationName, dataDeserializer, variablesSerializer
    )

  override fun equals(other: Any?): Boolean =
    other is DefaultConnectorGeneratedQueryImpl<*,*> &&
    other.connector == connector &&
    other.operationName == operationName &&
    other.dataDeserializer == dataDeserializer &&
    other.variablesSerializer == variablesSerializer

  override fun hashCode(): Int =
    java.util.Objects.hash(
      "DefaultConnectorGeneratedQueryImpl",
      connector, operationName, dataDeserializer, variablesSerializer
    )

  override fun toString(): String =
    "DefaultConnectorGeneratedQueryImpl(" +
    "operationName=$operationName, " +
    "dataDeserializer=$dataDeserializer, " +
    "variablesSerializer=$variablesSerializer, " +
    "connector=$connector)"
}

private open class DefaultConnectorGeneratedMutationImpl<Data, Variables>(
  override val connector: DefaultConnector,
  override val operationName: String,
  override val dataDeserializer: kotlinx.serialization.DeserializationStrategy<Data>,
  override val variablesSerializer: kotlinx.serialization.SerializationStrategy<Variables>,
) : com.google.firebase.dataconnect.generated.GeneratedMutation<DefaultConnector, Data, Variables> {

  @com.google.firebase.dataconnect.ExperimentalFirebaseDataConnect
  override fun copy(
    connector: DefaultConnector,
    operationName: String,
    dataDeserializer: kotlinx.serialization.DeserializationStrategy<Data>,
    variablesSerializer: kotlinx.serialization.SerializationStrategy<Variables>,
  ) =
    DefaultConnectorGeneratedMutationImpl(
      connector, operationName, dataDeserializer, variablesSerializer
    )

  @com.google.firebase.dataconnect.ExperimentalFirebaseDataConnect
  override fun <NewVariables> withVariablesSerializer(
    variablesSerializer: kotlinx.serialization.SerializationStrategy<NewVariables>
  ) =
    DefaultConnectorGeneratedMutationImpl(
      connector, operationName, dataDeserializer, variablesSerializer
    )

  @com.google.firebase.dataconnect.ExperimentalFirebaseDataConnect
  override fun <NewData> withDataDeserializer(
    dataDeserializer: kotlinx.serialization.DeserializationStrategy<NewData>
  ) =
    DefaultConnectorGeneratedMutationImpl(
      connector, operationName, dataDeserializer, variablesSerializer
    )

  override fun equals(other: Any?): Boolean =
    other is DefaultConnectorGeneratedMutationImpl<*,*> &&
    other.connector == connector &&
    other.operationName == operationName &&
    other.dataDeserializer == dataDeserializer &&
    other.variablesSerializer == variablesSerializer

  override fun hashCode(): Int =
    java.util.Objects.hash(
      "DefaultConnectorGeneratedMutationImpl",
      connector, operationName, dataDeserializer, variablesSerializer
    )

  override fun toString(): String =
    "DefaultConnectorGeneratedMutationImpl(" +
    "operationName=$operationName, " +
    "dataDeserializer=$dataDeserializer, " +
    "variablesSerializer=$variablesSerializer, " +
    "connector=$connector)"
}



private class CreateArtifactMutationImpl(
  connector: DefaultConnector
):
  CreateArtifactMutation,
  DefaultConnectorGeneratedMutationImpl<
      CreateArtifactMutation.Data,
      CreateArtifactMutation.Variables
  >(
    connector,
    CreateArtifactMutation.Companion.operationName,
    CreateArtifactMutation.Companion.dataDeserializer,
    CreateArtifactMutation.Companion.variablesSerializer,
  )


private class CreateEngagementMutationImpl(
  connector: DefaultConnector
):
  CreateEngagementMutation,
  DefaultConnectorGeneratedMutationImpl<
      CreateEngagementMutation.Data,
      CreateEngagementMutation.Variables
  >(
    connector,
    CreateEngagementMutation.Companion.operationName,
    CreateEngagementMutation.Companion.dataDeserializer,
    CreateEngagementMutation.Companion.variablesSerializer,
  )


private class CreateInsightMutationImpl(
  connector: DefaultConnector
):
  CreateInsightMutation,
  DefaultConnectorGeneratedMutationImpl<
      CreateInsightMutation.Data,
      CreateInsightMutation.Variables
  >(
    connector,
    CreateInsightMutation.Companion.operationName,
    CreateInsightMutation.Companion.dataDeserializer,
    CreateInsightMutation.Companion.variablesSerializer,
  )


private class GetEngagementDetailsQueryImpl(
  connector: DefaultConnector
):
  GetEngagementDetailsQuery,
  DefaultConnectorGeneratedQueryImpl<
      GetEngagementDetailsQuery.Data,
      GetEngagementDetailsQuery.Variables
  >(
    connector,
    GetEngagementDetailsQuery.Companion.operationName,
    GetEngagementDetailsQuery.Companion.dataDeserializer,
    GetEngagementDetailsQuery.Companion.variablesSerializer,
  )


private class GetKnowledgeItemQueryImpl(
  connector: DefaultConnector
):
  GetKnowledgeItemQuery,
  DefaultConnectorGeneratedQueryImpl<
      GetKnowledgeItemQuery.Data,
      GetKnowledgeItemQuery.Variables
  >(
    connector,
    GetKnowledgeItemQuery.Companion.operationName,
    GetKnowledgeItemQuery.Companion.dataDeserializer,
    GetKnowledgeItemQuery.Companion.variablesSerializer,
  )


private class ListEngagementsQueryImpl(
  connector: DefaultConnector
):
  ListEngagementsQuery,
  DefaultConnectorGeneratedQueryImpl<
      ListEngagementsQuery.Data,
      ListEngagementsQuery.Variables
  >(
    connector,
    ListEngagementsQuery.Companion.operationName,
    ListEngagementsQuery.Companion.dataDeserializer,
    ListEngagementsQuery.Companion.variablesSerializer,
  )


private class MarkInsightPromotedMutationImpl(
  connector: DefaultConnector
):
  MarkInsightPromotedMutation,
  DefaultConnectorGeneratedMutationImpl<
      MarkInsightPromotedMutation.Data,
      MarkInsightPromotedMutation.Variables
  >(
    connector,
    MarkInsightPromotedMutation.Companion.operationName,
    MarkInsightPromotedMutation.Companion.dataDeserializer,
    MarkInsightPromotedMutation.Companion.variablesSerializer,
  )


private class SearchKnowledgeBaseQueryImpl(
  connector: DefaultConnector
):
  SearchKnowledgeBaseQuery,
  DefaultConnectorGeneratedQueryImpl<
      SearchKnowledgeBaseQuery.Data,
      SearchKnowledgeBaseQuery.Variables
  >(
    connector,
    SearchKnowledgeBaseQuery.Companion.operationName,
    SearchKnowledgeBaseQuery.Companion.dataDeserializer,
    SearchKnowledgeBaseQuery.Companion.variablesSerializer,
  )


private class UpdateEngagementStatusMutationImpl(
  connector: DefaultConnector
):
  UpdateEngagementStatusMutation,
  DefaultConnectorGeneratedMutationImpl<
      UpdateEngagementStatusMutation.Data,
      UpdateEngagementStatusMutation.Variables
  >(
    connector,
    UpdateEngagementStatusMutation.Companion.operationName,
    UpdateEngagementStatusMutation.Companion.dataDeserializer,
    UpdateEngagementStatusMutation.Companion.variablesSerializer,
  )


