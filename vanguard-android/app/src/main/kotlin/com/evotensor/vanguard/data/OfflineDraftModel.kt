package com.evotensor.vanguard.data

enum class SyncStatus {
    PENDING,
    SYNCING,
    SYNCED,
    FAILED
}

data class OfflineDraftItem(
    val draftId: String,
    val title: String,
    val type: String,
    val transcript: String,
    val audioFileName: String?,
    val syncStatus: SyncStatus,
    val createdAt: Long = System.currentTimeMillis()
)
