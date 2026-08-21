
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


import kotlinx.coroutines.flow.filterNotNull as _flow_filterNotNull
import kotlinx.coroutines.flow.map as _flow_map


public interface SearchKnowledgeBaseQuery :
    com.google.firebase.dataconnect.generated.GeneratedQuery<
      DefaultConnector,
      SearchKnowledgeBaseQuery.Data,
      SearchKnowledgeBaseQuery.Variables
    >
{
  
    @kotlinx.serialization.Serializable
  public data class Variables(
  
    val query: String,
  
    val teamId: @kotlinx.serialization.Serializable(with = com.google.firebase.dataconnect.serializers.UUIDSerializer::class) java.util.UUID,
  
  ) {
    
    
  }
  

  
    @kotlinx.serialization.Serializable
  public data class Data(
  
    val knowledgeItems_search: List<KnowledgeItemsSearchItem>,
  
  ) {
    
      
        @kotlinx.serialization.Serializable
  public data class KnowledgeItemsSearchItem(
  
    val id: @kotlinx.serialization.Serializable(with = com.google.firebase.dataconnect.serializers.UUIDSerializer::class) java.util.UUID,
  
    val title: String,
  
    val summary: String,
  
    val category: @kotlinx.serialization.Serializable(with = KnowledgeCategory.EnumValueSerializer::class) EnumValue<KnowledgeCategory>,
  
    val confidence: Double?,
  
    val createdAt: @kotlinx.serialization.Serializable(with = com.google.firebase.dataconnect.serializers.TimestampSerializer::class) com.google.firebase.Timestamp,
  
  ) {
    
    
  }
      
    
    
  }
  

  public companion object {
    public val operationName: String = "SearchKnowledgeBase"

    public val dataDeserializer: kotlinx.serialization.DeserializationStrategy<Data> =
      kotlinx.serialization.serializer()

    public val variablesSerializer: kotlinx.serialization.SerializationStrategy<Variables> =
      kotlinx.serialization.serializer()
  }
}

public fun SearchKnowledgeBaseQuery.ref(
  
    query: String,teamId: java.util.UUID,

  
  
): com.google.firebase.dataconnect.QueryRef<
    SearchKnowledgeBaseQuery.Data,
    SearchKnowledgeBaseQuery.Variables
  > =
  ref(
    
      SearchKnowledgeBaseQuery.Variables(
        query=query,teamId=teamId,
  
      )
    
  )

public suspend fun SearchKnowledgeBaseQuery.execute(

  
    
      query: String,teamId: java.util.UUID,

  

  ): com.google.firebase.dataconnect.QueryResult<
    SearchKnowledgeBaseQuery.Data,
    SearchKnowledgeBaseQuery.Variables
  > =
  ref(
    
      query=query,teamId=teamId,
  
    
  ).execute()


  public fun SearchKnowledgeBaseQuery.flow(
    
      query: String,teamId: java.util.UUID,

  
    
    ): kotlinx.coroutines.flow.Flow<SearchKnowledgeBaseQuery.Data> =
    ref(
        
          query=query,teamId=teamId,
  
        
      ).subscribe()
      .flow
      ._flow_map { querySubscriptionResult -> querySubscriptionResult.result.getOrNull() }
      ._flow_filterNotNull()
      ._flow_map { it.data }

