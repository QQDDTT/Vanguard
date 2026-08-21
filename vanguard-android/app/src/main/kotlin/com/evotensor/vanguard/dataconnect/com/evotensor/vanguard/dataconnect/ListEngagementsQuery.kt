
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


public interface ListEngagementsQuery :
    com.google.firebase.dataconnect.generated.GeneratedQuery<
      DefaultConnector,
      ListEngagementsQuery.Data,
      ListEngagementsQuery.Variables
    >
{
  
    @kotlinx.serialization.Serializable
  public data class Variables(
  
    val teamId: @kotlinx.serialization.Serializable(with = com.google.firebase.dataconnect.serializers.UUIDSerializer::class) java.util.UUID,
  
  ) {
    
    
  }
  

  
    @kotlinx.serialization.Serializable
  public data class Data(
  
    val engagements: List<EngagementsItem>,
  
  ) {
    
      
        @kotlinx.serialization.Serializable
  public data class EngagementsItem(
  
    val id: @kotlinx.serialization.Serializable(with = com.google.firebase.dataconnect.serializers.UUIDSerializer::class) java.util.UUID,
  
    val type: @kotlinx.serialization.Serializable(with = EngagementType.EnumValueSerializer::class) EnumValue<EngagementType>,
  
    val status: @kotlinx.serialization.Serializable(with = EngagementStatus.EnumValueSerializer::class) EnumValue<EngagementStatus>,
  
    val customerName: String,
  
    val title: String?,
  
    val createdAt: @kotlinx.serialization.Serializable(with = com.google.firebase.dataconnect.serializers.TimestampSerializer::class) com.google.firebase.Timestamp,
  
    val user: User,
  
  ) {
    
      
        @kotlinx.serialization.Serializable
  public data class User(
  
    val uid: String,
  
    val displayName: String,
  
  ) {
    
    
  }
      
    
    
  }
      
    
    
  }
  

  public companion object {
    public val operationName: String = "ListEngagements"

    public val dataDeserializer: kotlinx.serialization.DeserializationStrategy<Data> =
      kotlinx.serialization.serializer()

    public val variablesSerializer: kotlinx.serialization.SerializationStrategy<Variables> =
      kotlinx.serialization.serializer()
  }
}

public fun ListEngagementsQuery.ref(
  
    teamId: java.util.UUID,

  
  
): com.google.firebase.dataconnect.QueryRef<
    ListEngagementsQuery.Data,
    ListEngagementsQuery.Variables
  > =
  ref(
    
      ListEngagementsQuery.Variables(
        teamId=teamId,
  
      )
    
  )

public suspend fun ListEngagementsQuery.execute(

  
    
      teamId: java.util.UUID,

  

  ): com.google.firebase.dataconnect.QueryResult<
    ListEngagementsQuery.Data,
    ListEngagementsQuery.Variables
  > =
  ref(
    
      teamId=teamId,
  
    
  ).execute()


  public fun ListEngagementsQuery.flow(
    
      teamId: java.util.UUID,

  
    
    ): kotlinx.coroutines.flow.Flow<ListEngagementsQuery.Data> =
    ref(
        
          teamId=teamId,
  
        
      ).subscribe()
      .flow
      ._flow_map { querySubscriptionResult -> querySubscriptionResult.result.getOrNull() }
      ._flow_filterNotNull()
      ._flow_map { it.data }

