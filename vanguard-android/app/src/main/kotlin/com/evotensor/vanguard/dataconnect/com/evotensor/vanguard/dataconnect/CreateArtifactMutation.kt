
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



public interface CreateArtifactMutation :
    com.google.firebase.dataconnect.generated.GeneratedMutation<
      DefaultConnector,
      CreateArtifactMutation.Data,
      CreateArtifactMutation.Variables
    >
{
  
    @kotlinx.serialization.Serializable
  public data class Variables(
  
    val engagementId: @kotlinx.serialization.Serializable(with = com.google.firebase.dataconnect.serializers.UUIDSerializer::class) java.util.UUID,
  
    val type: ArtifactType,
  
    val storageUrl: String,
  
    val fileName: String,
  
    val fileSizeBytes: com.google.firebase.dataconnect.OptionalVariable<Long?>,
  
  ) {
    
    
      
      @kotlin.DslMarker public annotation class BuilderDsl

      
      @BuilderDsl
      public interface Builder {
        public var engagementId: java.util.UUID
        public var type: ArtifactType
        public var storageUrl: String
        public var fileName: String
        public var fileSizeBytes: Long?
        
      }

      public companion object {
        
        @Suppress("NAME_SHADOWING")
        public fun build(
          engagementId: java.util.UUID,type: ArtifactType,storageUrl: String,fileName: String,
          block_: Builder.() -> Unit
        ): Variables {
          var engagementId= engagementId
            var type= type
            var storageUrl= storageUrl
            var fileName= fileName
            var fileSizeBytes: com.google.firebase.dataconnect.OptionalVariable<Long?> =
                com.google.firebase.dataconnect.OptionalVariable.Undefined
            

          return object : Builder {
            override var engagementId: java.util.UUID
              get() = throw UnsupportedOperationException("getting builder values is not supported")
              set(value_) { engagementId = value_ }
              
            override var type: ArtifactType
              get() = throw UnsupportedOperationException("getting builder values is not supported")
              set(value_) { type = value_ }
              
            override var storageUrl: String
              get() = throw UnsupportedOperationException("getting builder values is not supported")
              set(value_) { storageUrl = value_ }
              
            override var fileName: String
              get() = throw UnsupportedOperationException("getting builder values is not supported")
              set(value_) { fileName = value_ }
              
            override var fileSizeBytes: Long?
              get() = throw UnsupportedOperationException("getting builder values is not supported")
              set(value_) { fileSizeBytes = com.google.firebase.dataconnect.OptionalVariable.Value(value_) }
              
            
          }.apply(block_)
          .let {
            Variables(
              engagementId=engagementId,type=type,storageUrl=storageUrl,fileName=fileName,fileSizeBytes=fileSizeBytes,
            )
          }
        }
      }
    
  }
  

  
    @kotlinx.serialization.Serializable
  public data class Data(
  
    val artifact_insert: ArtifactKey,
  
  ) {
    
    
  }
  

  public companion object {
    public val operationName: String = "CreateArtifact"

    public val dataDeserializer: kotlinx.serialization.DeserializationStrategy<Data> =
      kotlinx.serialization.serializer()

    public val variablesSerializer: kotlinx.serialization.SerializationStrategy<Variables> =
      kotlinx.serialization.serializer()
  }
}

public fun CreateArtifactMutation.ref(
  
    engagementId: java.util.UUID,type: ArtifactType,storageUrl: String,fileName: String,

  
    block_: CreateArtifactMutation.Variables.Builder.() -> Unit = {}
  
): com.google.firebase.dataconnect.MutationRef<
    CreateArtifactMutation.Data,
    CreateArtifactMutation.Variables
  > =
  ref(
    
      CreateArtifactMutation.Variables.build(
        engagementId=engagementId,type=type,storageUrl=storageUrl,fileName=fileName,
  
    block_
      )
    
  )

public suspend fun CreateArtifactMutation.execute(

  
    
      engagementId: java.util.UUID,type: ArtifactType,storageUrl: String,fileName: String,

  
    block_: CreateArtifactMutation.Variables.Builder.() -> Unit = {}

  ): com.google.firebase.dataconnect.MutationResult<
    CreateArtifactMutation.Data,
    CreateArtifactMutation.Variables
  > =
  ref(
    
      engagementId=engagementId,type=type,storageUrl=storageUrl,fileName=fileName,
  
    block_
    
  ).execute()


