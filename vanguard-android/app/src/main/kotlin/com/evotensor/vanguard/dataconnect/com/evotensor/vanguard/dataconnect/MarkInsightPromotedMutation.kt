
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



public interface MarkInsightPromotedMutation :
    com.google.firebase.dataconnect.generated.GeneratedMutation<
      DefaultConnector,
      MarkInsightPromotedMutation.Data,
      MarkInsightPromotedMutation.Variables
    >
{
  
    @kotlinx.serialization.Serializable
  public data class Variables(
  
    val id: @kotlinx.serialization.Serializable(with = com.google.firebase.dataconnect.serializers.UUIDSerializer::class) java.util.UUID,
  
  ) {
    
    
  }
  

  
    @kotlinx.serialization.Serializable
  public data class Data(
  
    val insight_update: InsightKey?,
  
  ) {
    
    
  }
  

  public companion object {
    public val operationName: String = "MarkInsightPromoted"

    public val dataDeserializer: kotlinx.serialization.DeserializationStrategy<Data> =
      kotlinx.serialization.serializer()

    public val variablesSerializer: kotlinx.serialization.SerializationStrategy<Variables> =
      kotlinx.serialization.serializer()
  }
}

public fun MarkInsightPromotedMutation.ref(
  
    id: java.util.UUID,

  
  
): com.google.firebase.dataconnect.MutationRef<
    MarkInsightPromotedMutation.Data,
    MarkInsightPromotedMutation.Variables
  > =
  ref(
    
      MarkInsightPromotedMutation.Variables(
        id=id,
  
      )
    
  )

public suspend fun MarkInsightPromotedMutation.execute(

  
    
      id: java.util.UUID,

  

  ): com.google.firebase.dataconnect.MutationResult<
    MarkInsightPromotedMutation.Data,
    MarkInsightPromotedMutation.Variables
  > =
  ref(
    
      id=id,
  
    
  ).execute()


