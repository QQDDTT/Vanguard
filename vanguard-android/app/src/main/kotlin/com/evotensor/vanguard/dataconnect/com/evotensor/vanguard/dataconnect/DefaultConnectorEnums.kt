
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


  
  
  public enum class ArtifactType {
  AUDIO,
  IMAGE,
  LOG,
  NOTE,
  DOCUMENT;
  
  
    public object EnumValueSerializer :
      com.evotensor.vanguard.dataconnect.EnumValueSerializer<ArtifactType>(ArtifactType.entries)
  
  }

  
  
  public enum class EngagementStatus {
  CREATED,
  PROCESSING,
  COMPLETED,
  FAILED;
  
  
    public object EnumValueSerializer :
      com.evotensor.vanguard.dataconnect.EnumValueSerializer<EngagementStatus>(EngagementStatus.entries)
  
  }

  
  
  public enum class EngagementType {
  INTERVIEW,
  INFRA_SURVEY,
  POC_TRACKING,
  TROUBLESHOOTING,
  SOW_PROPOSAL;
  
  
    public object EnumValueSerializer :
      com.evotensor.vanguard.dataconnect.EnumValueSerializer<EngagementType>(EngagementType.entries)
  
  }

  
  
  public enum class InsightDimension {
  FUNCTIONAL,
  PAIN_POINT,
  JOBS_TO_BE_DONE,
  LATENT_DESIRE,
  EMOTIONAL,
  SOCIAL,
  CONSTRAINT;
  
  
    public object EnumValueSerializer :
      com.evotensor.vanguard.dataconnect.EnumValueSerializer<InsightDimension>(InsightDimension.entries)
  
  }

  
  
  public enum class KnowledgeCategory {
  INDUSTRY_BACKGROUND,
  CUSTOMER_PATTERN,
  COMPETITOR_INSIGHT,
  METHODOLOGY,
  CASE_STUDY;
  
  
    public object EnumValueSerializer :
      com.evotensor.vanguard.dataconnect.EnumValueSerializer<KnowledgeCategory>(KnowledgeCategory.entries)
  
  }

