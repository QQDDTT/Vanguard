
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



public interface UpdateEngagementStatusMutation :
    com.google.firebase.dataconnect.generated.GeneratedMutation<
      DefaultConnector,
      UpdateEngagementStatusMutation.Data,
      UpdateEngagementStatusMutation.Variables
    >
{
  
    @kotlinx.serialization.Serializable
  public data class Variables(
  
    val id: @kotlinx.serialization.Serializable(with = com.google.firebase.dataconnect.serializers.UUIDSerializer::class) java.util.UUID,
  
    val status: EngagementStatus,
  
  ) {
    
    
  }
  

  
    @kotlinx.serialization.Serializable
  public data class Data(
  
    val engagement_update: EngagementKey?,
  
  ) {
    
    
  }
  

  public companion object {
    public val operationName: String = "UpdateEngagementStatus"

    public val dataDeserializer: kotlinx.serialization.DeserializationStrategy<Data> =
      kotlinx.serialization.serializer()

    public val variablesSerializer: kotlinx.serialization.SerializationStrategy<Variables> =
      kotlinx.serialization.serializer()
  }
}

public fun UpdateEngagementStatusMutation.ref(
  
    id: java.util.UUID,status: EngagementStatus,

  
  
): com.google.firebase.dataconnect.MutationRef<
    UpdateEngagementStatusMutation.Data,
    UpdateEngagementStatusMutation.Variables
  > =
  ref(
    
      UpdateEngagementStatusMutation.Variables(
        id=id,status=status,
  
      )
    
  )

public suspend fun UpdateEngagementStatusMutation.execute(

  
    
      id: java.util.UUID,status: EngagementStatus,

  

  ): com.google.firebase.dataconnect.MutationResult<
    UpdateEngagementStatusMutation.Data,
    UpdateEngagementStatusMutation.Variables
  > =
  ref(
    
      id=id,status=status,
  
    
  ).execute()


