
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



public interface CreateEngagementMutation :
    com.google.firebase.dataconnect.generated.GeneratedMutation<
      DefaultConnector,
      CreateEngagementMutation.Data,
      CreateEngagementMutation.Variables
    >
{
  
    @kotlinx.serialization.Serializable
  public data class Variables(
  
    val teamId: @kotlinx.serialization.Serializable(with = com.google.firebase.dataconnect.serializers.UUIDSerializer::class) java.util.UUID,
  
    val type: com.google.firebase.dataconnect.OptionalVariable<EngagementType?>,
  
    val customerName: String,
  
    val title: com.google.firebase.dataconnect.OptionalVariable<String?>,
  
    val context: com.google.firebase.dataconnect.OptionalVariable<String?>,
  
  ) {
    
    
      
      @kotlin.DslMarker public annotation class BuilderDsl

      
      @BuilderDsl
      public interface Builder {
        public var teamId: java.util.UUID
        public var type: EngagementType?
        public var customerName: String
        public var title: String?
        public var context: String?
        
      }

      public companion object {
        
        @Suppress("NAME_SHADOWING")
        public fun build(
          teamId: java.util.UUID,customerName: String,
          block_: Builder.() -> Unit
        ): Variables {
          var teamId= teamId
            var type: com.google.firebase.dataconnect.OptionalVariable<EngagementType?> =
                com.google.firebase.dataconnect.OptionalVariable.Undefined
            var customerName= customerName
            var title: com.google.firebase.dataconnect.OptionalVariable<String?> =
                com.google.firebase.dataconnect.OptionalVariable.Undefined
            var context: com.google.firebase.dataconnect.OptionalVariable<String?> =
                com.google.firebase.dataconnect.OptionalVariable.Undefined
            

          return object : Builder {
            override var teamId: java.util.UUID
              get() = throw UnsupportedOperationException("getting builder values is not supported")
              set(value_) { teamId = value_ }
              
            override var type: EngagementType?
              get() = throw UnsupportedOperationException("getting builder values is not supported")
              set(value_) { type = com.google.firebase.dataconnect.OptionalVariable.Value(value_) }
              
            override var customerName: String
              get() = throw UnsupportedOperationException("getting builder values is not supported")
              set(value_) { customerName = value_ }
              
            override var title: String?
              get() = throw UnsupportedOperationException("getting builder values is not supported")
              set(value_) { title = com.google.firebase.dataconnect.OptionalVariable.Value(value_) }
              
            override var context: String?
              get() = throw UnsupportedOperationException("getting builder values is not supported")
              set(value_) { context = com.google.firebase.dataconnect.OptionalVariable.Value(value_) }
              
            
          }.apply(block_)
          .let {
            Variables(
              teamId=teamId,type=type,customerName=customerName,title=title,context=context,
            )
          }
        }
      }
    
  }
  

  
    @kotlinx.serialization.Serializable
  public data class Data(
  
    val engagement_insert: EngagementKey,
  
  ) {
    
    
  }
  

  public companion object {
    public val operationName: String = "CreateEngagement"

    public val dataDeserializer: kotlinx.serialization.DeserializationStrategy<Data> =
      kotlinx.serialization.serializer()

    public val variablesSerializer: kotlinx.serialization.SerializationStrategy<Variables> =
      kotlinx.serialization.serializer()
  }
}

public fun CreateEngagementMutation.ref(
  
    teamId: java.util.UUID,customerName: String,

  
    block_: CreateEngagementMutation.Variables.Builder.() -> Unit = {}
  
): com.google.firebase.dataconnect.MutationRef<
    CreateEngagementMutation.Data,
    CreateEngagementMutation.Variables
  > =
  ref(
    
      CreateEngagementMutation.Variables.build(
        teamId=teamId,customerName=customerName,
  
    block_
      )
    
  )

public suspend fun CreateEngagementMutation.execute(

  
    
      teamId: java.util.UUID,customerName: String,

  
    block_: CreateEngagementMutation.Variables.Builder.() -> Unit = {}

  ): com.google.firebase.dataconnect.MutationResult<
    CreateEngagementMutation.Data,
    CreateEngagementMutation.Variables
  > =
  ref(
    
      teamId=teamId,customerName=customerName,
  
    block_
    
  ).execute()


