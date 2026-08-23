package com.evotensor.vanguard.data

import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.delay

object SyncManager {
    private val _drafts = MutableStateFlow<List<OfflineDraftItem>>(
        listOf(
            OfflineDraftItem(
                draftId = "draft-101",
                title = "某券商地下核心机房现场勘测笔记",
                type = "INFRA_SURVEY",
                transcript = "机房位于地下二层无手机信号。机架为 42U，双路冗余电源已插接，核心网卡型号为 ConnectX-6。",
                audioFileName = "site_survey_audio_01.m4a",
                syncStatus = SyncStatus.PENDING
            ),
            OfflineDraftItem(
                draftId = "draft-102",
                title = "量化回测集群网络抖动排障速记",
                type = "TROUBLESHOOTING",
                transcript = "抓包发现 22:00 突发大量丢包，疑似交换机 QoS 策略限制了 UDP 广播流量。",
                audioFileName = null,
                syncStatus = SyncStatus.PENDING
            )
        )
    )
    val drafts: StateFlow<List<OfflineDraftItem>> = _drafts.asStateFlow()

    private val _isOfflineMode = MutableStateFlow(false)
    val isOfflineMode: StateFlow<Boolean> = _isOfflineMode.asStateFlow()

    fun setOfflineMode(offline: Boolean) {
        _isOfflineMode.value = offline
    }

    fun addDraft(title: String, type: String, transcript: String, audioFileName: String?) {
        val newDraft = OfflineDraftItem(
            draftId = "draft-${System.currentTimeMillis()}",
            title = title,
            type = type,
            transcript = transcript,
            audioFileName = audioFileName,
            syncStatus = SyncStatus.PENDING
        )
        _drafts.value = listOf(newDraft) + _drafts.value
    }

    suspend fun syncAllDrafts() {
        val current = _drafts.value
        val updated = current.map { 
            if (it.syncStatus == SyncStatus.PENDING) it.copy(syncStatus = SyncStatus.SYNCING) else it 
        }
        _drafts.value = updated

        // 模拟网络上传延迟
        delay(1200L)

        _drafts.value = _drafts.value.map {
            if (it.syncStatus == SyncStatus.SYNCING) it.copy(syncStatus = SyncStatus.SYNCED) else it
        }
    }

    fun removeDraft(draftId: String) {
        _drafts.value = _drafts.value.filter { it.draftId != draftId }
    }
}
