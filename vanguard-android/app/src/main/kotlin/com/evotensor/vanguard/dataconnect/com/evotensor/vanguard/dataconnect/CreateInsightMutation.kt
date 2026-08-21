
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



public interface CreateInsightMutation :
    com.google.firebase.dataconnect.generated.GeneratedMutation<
      DefaultConnector,
      CreateInsightMutation.Data,
      CreateInsightMutation.Variables
    >
{
  
    @kotlinx.serialization.Serializable
  public data class Variables(
  
    val engagementId: @kotlinx.serialization.Serializable(with = com.google.firebase.dataconnect.serializers.UUIDSerializer::class) java.util.UUID,
  
    val dimension: InsightDimension,
  
    val content: String,
  
    val confidence: com.google.firebase.dataconnect.OptionalVariable<Double?>,
  
  ) {
    
    
      
      @kotlin.DslMarker public annotation class BuilderDsl

      
      @BuilderDsl
      public interface Builder {
        public var engagementId: java.util.UUID
        public var dimension: InsightDimension
        public var content: String
        public var confidence: Double?
        
      }

      public companion object {
        
        @Suppress("NAME_SHADOWING")
        public fun build(
          engagementId: java.util.UUID,dimension: InsightDimension,content: String,
          block_: Builder.() -> Unit
        ): Variables {
          var engagementId= engagementId
            var dimension= dimension
            var content= content
            var confidence: com.google.firebase.dataconnect.OptionalVariable<Double?> =
                com.google.firebase.dataconnect.OptionalVariable.Undefined
            

          return object : Builder {
            override var engagementId: java.util.UUID
              get() = throw UnsupportedOperationException("getting builder values is not supported")
              set(value_) { engagementId = value_ }
              
            override var dimension: InsightDimension
              get() = throw UnsupportedOperationException("getting builder values is not supported")
              set(value_) { dimension = value_ }
              
            override var content: String
              get() = throw UnsupportedOperationException("getting builder values is not supported")
              set(value_) { content = value_ }
              
            override var confidence: Double?
              get() = throw UnsupportedOperationException("getting builder values is not supported")
              set(value_) { confidence = com.google.firebase.dataconnect.OptionalVariable.Value(value_) }
              
            
          }.apply(block_)
          .let {
            Variables(
              engagementId=engagementId,dimension=dimension,content=content,confidence=confidence,
            )
          }
        }
      }
    
  }
  

  
    @kotlinx.serialization.Serializable
  public data class Data(
  
    val insight_insert: InsightKey,
  
  ) {
    
    
  }
  

  public companion object {
    public val operationName: String = "CreateInsight"

    public val dataDeserializer: kotlinx.serialization.DeserializationStrategy<Data> =
      kotlinx.serialization.serializer()

    public val variablesSerializer: kotlinx.serialization.SerializationStrategy<Variables> =
      kotlinx.serialization.serializer()
  }
}

public fun CreateInsightMutation.ref(
  
    engagementId: java.util.UUID,dimension: InsightDimension,content: String,

  
    block_: CreateInsightMutation.Variables.Builder.() -> Unit = {}
  
): com.google.firebase.dataconnect.MutationRef<
    CreateInsightMutation.Data,
    CreateInsightMutation.Variables
  > =
  ref(
    
      CreateInsightMutation.Variables.build(
        engagementId=engagementId,dimension=dimension,content=content,
  
    block_
      )
    
  )

public suspend fun CreateInsightMutation.execute(

  
    
      engagementId: java.util.UUID,dimension: InsightDimension,content: String,

  
    block_: CreateInsightMutation.Variables.Builder.() -> Unit = {}

  ): com.google.firebase.dataconnect.MutationResult<
    CreateInsightMutation.Data,
    CreateInsightMutation.Variables
  > =
  ref(
    
      engagementId=engagementId,dimension=dimension,content=content,
  
    block_
    
  ).execute()


