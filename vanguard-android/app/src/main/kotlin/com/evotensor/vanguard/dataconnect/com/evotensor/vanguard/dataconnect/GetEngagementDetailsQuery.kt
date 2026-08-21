
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


public interface GetEngagementDetailsQuery :
    com.google.firebase.dataconnect.generated.GeneratedQuery<
      DefaultConnector,
      GetEngagementDetailsQuery.Data,
      GetEngagementDetailsQuery.Variables
    >
{
  
    @kotlinx.serialization.Serializable
  public data class Variables(
  
    val id: @kotlinx.serialization.Serializable(with = com.google.firebase.dataconnect.serializers.UUIDSerializer::class) java.util.UUID,
  
  ) {
    
    
  }
  

  
    @kotlinx.serialization.Serializable
  public data class Data(
  
    val engagement: Engagement?,
  
  ) {
    
      
        @kotlinx.serialization.Serializable
  public data class Engagement(
  
    val id: @kotlinx.serialization.Serializable(with = com.google.firebase.dataconnect.serializers.UUIDSerializer::class) java.util.UUID,
  
    val type: @kotlinx.serialization.Serializable(with = EngagementType.EnumValueSerializer::class) EnumValue<EngagementType>,
  
    val status: @kotlinx.serialization.Serializable(with = EngagementStatus.EnumValueSerializer::class) EnumValue<EngagementStatus>,
  
    val customerName: String,
  
    val title: String?,
  
    val context: String?,
  
    val createdAt: @kotlinx.serialization.Serializable(with = com.google.firebase.dataconnect.serializers.TimestampSerializer::class) com.google.firebase.Timestamp,
  
    val updatedAt: @kotlinx.serialization.Serializable(with = com.google.firebase.dataconnect.serializers.TimestampSerializer::class) com.google.firebase.Timestamp,
  
    val user: User,
  
    val artifacts_on_engagement: List<ArtifactsOnEngagementItem>,
  
    val insights_on_engagement: List<InsightsOnEngagementItem>,
  
  ) {
    
      
        @kotlinx.serialization.Serializable
  public data class User(
  
    val uid: String,
  
    val displayName: String,
  
  ) {
    
    
  }
      
        @kotlinx.serialization.Serializable
  public data class ArtifactsOnEngagementItem(
  
    val id: @kotlinx.serialization.Serializable(with = com.google.firebase.dataconnect.serializers.UUIDSerializer::class) java.util.UUID,
  
    val type: @kotlinx.serialization.Serializable(with = ArtifactType.EnumValueSerializer::class) EnumValue<ArtifactType>,
  
    val storageUrl: String,
  
    val fileName: String,
  
    val fileSizeBytes: Long?,
  
    val createdAt: @kotlinx.serialization.Serializable(with = com.google.firebase.dataconnect.serializers.TimestampSerializer::class) com.google.firebase.Timestamp,
  
  ) {
    
    
  }
      
        @kotlinx.serialization.Serializable
  public data class InsightsOnEngagementItem(
  
    val id: @kotlinx.serialization.Serializable(with = com.google.firebase.dataconnect.serializers.UUIDSerializer::class) java.util.UUID,
  
    val dimension: @kotlinx.serialization.Serializable(with = InsightDimension.EnumValueSerializer::class) EnumValue<InsightDimension>,
  
    val content: String,
  
    val confidence: Double?,
  
    val isPromoted: Boolean?,
  
    val createdAt: @kotlinx.serialization.Serializable(with = com.google.firebase.dataconnect.serializers.TimestampSerializer::class) com.google.firebase.Timestamp,
  
  ) {
    
    
  }
      
    
    
  }
      
    
    
  }
  

  public companion object {
    public val operationName: String = "GetEngagementDetails"

    public val dataDeserializer: kotlinx.serialization.DeserializationStrategy<Data> =
      kotlinx.serialization.serializer()

    public val variablesSerializer: kotlinx.serialization.SerializationStrategy<Variables> =
      kotlinx.serialization.serializer()
  }
}

public fun GetEngagementDetailsQuery.ref(
  
    id: java.util.UUID,

  
  
): com.google.firebase.dataconnect.QueryRef<
    GetEngagementDetailsQuery.Data,
    GetEngagementDetailsQuery.Variables
  > =
  ref(
    
      GetEngagementDetailsQuery.Variables(
        id=id,
  
      )
    
  )

public suspend fun GetEngagementDetailsQuery.execute(

  
    
      id: java.util.UUID,

  

  ): com.google.firebase.dataconnect.QueryResult<
    GetEngagementDetailsQuery.Data,
    GetEngagementDetailsQuery.Variables
  > =
  ref(
    
      id=id,
  
    
  ).execute()


  public fun GetEngagementDetailsQuery.flow(
    
      id: java.util.UUID,

  
    
    ): kotlinx.coroutines.flow.Flow<GetEngagementDetailsQuery.Data> =
    ref(
        
          id=id,
  
        
      ).subscribe()
      .flow
      ._flow_map { querySubscriptionResult -> querySubscriptionResult.result.getOrNull() }
      ._flow_filterNotNull()
      ._flow_map { it.data }

