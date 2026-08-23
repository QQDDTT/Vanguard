package com.evotensor.vanguard.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.CalendarToday
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material.icons.filled.CloudOff
import androidx.compose.material.icons.filled.CloudQueue
import androidx.compose.material.icons.filled.FolderZip
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.evotensor.vanguard.ui.theme.*
import com.evotensor.vanguard.data.SyncManager
import com.evotensor.vanguard.data.SyncStatus

data class EngagementUiModel(
    val id: String,
    val title: String,
    val customerName: String,
    val type: String,
    val status: String,
    val dateStr: String
)

val SampleEngagements = listOf(
    EngagementUiModel(
        id = "eng-001",
        title = "某头部量化机构回测集群交付",
        customerName = "幻方/九坤量化技术部",
        type = "INTERVIEW",
        status = "PROCESSING",
        dateStr = "2026-08-22"
    ),
    EngagementUiModel(
        id = "eng-002",
        title = "国有大行数据中心内网机架审计",
        customerName = "建信金科基础设施组",
        type = "INFRA_SURVEY",
        status = "OPEN",
        dateStr = "2026-08-20"
    ),
    EngagementUiModel(
        id = "eng-003",
        title = "高并发网卡驱动突发崩溃 RCA 排查",
        customerName = "头部券商交易系统部",
        type = "TROUBLESHOOTING",
        status = "PROCESSING",
        dateStr = "2026-08-19"
    ),
    EngagementUiModel(
        id = "eng-004",
        title = "智慧物流平台自动化回测 PoC 评估",
        customerName = "顺丰科技量化运营组",
        type = "POC_TRACKING",
        status = "OPEN",
        dateStr = "2026-08-18"
    )
)

val TypeFilters = listOf(
    "ALL" to "全部事务",
    "INTERVIEW" to "客户访谈",
    "INFRA_SURVEY" to "现场勘测",
    "POC_TRACKING" to "PoC卡点",
    "TROUBLESHOOTING" to "现场排障",
    "SOW_PROPOSAL" to "SOW提案"
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    onSelectEngagement: (id: String) -> Unit,
    onOpenDrafts: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    var selectedType by remember { mutableStateOf("ALL") }
    var engagements by remember { mutableStateOf(SampleEngagements) }
    var showCreateDialog by remember { mutableStateOf(false) }
    val drafts by SyncManager.drafts.collectAsState()
    val isOffline by SyncManager.isOfflineMode.collectAsState()
    val pendingCount = drafts.count { it.syncStatus == SyncStatus.PENDING }

    val filtered = remember(selectedType, engagements) {
        if (selectedType == "ALL") engagements
        else engagements.filter { it.type == selectedType }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Icon(Icons.Default.Shield, contentDescription = null, tint = if (isOffline) AccentAmber else PrimaryBlue)
                        Text(if (isOffline) "机房离线看板" else "现场看板", fontSize = 17.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
                    }
                },
                actions = {
                    // 离线机房模式切换
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                        Text(if (isOffline) "离线中" else "在线", fontSize = 11.sp, color = if (isOffline) AccentAmber else AccentEmerald)
                        Switch(
                            checked = isOffline,
                            onCheckedChange = { SyncManager.setOfflineMode(it) },
                            colors = SwitchDefaults.colors(
                                checkedThumbColor = AccentAmber,
                                checkedTrackColor = AccentAmber.copy(alpha = 0.3f)
                            ),
                            modifier = Modifier.height(24.dp)
                        )
                    }

                    // 离线草稿箱入口
                    IconButton(onClick = onOpenDrafts) {
                        BadgedBox(
                            badge = {
                                if (pendingCount > 0) {
                                    Badge(containerColor = AccentRose) {
                                        Text("$pendingCount", fontSize = 10.sp)
                                    }
                                }
                            }
                        ) {
                            Icon(Icons.Default.CloudQueue, contentDescription = "草稿箱", tint = TextPrimary)
                        }
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = DarkBackground)
            )
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showCreateDialog = true },
                containerColor = if (isOffline) AccentAmber else PrimaryBlue,
                contentColor = DarkBackground
            ) {
                Icon(Icons.Default.Add, contentDescription = "新建事务")
            }
        },
        containerColor = DarkBackground,
        modifier = modifier
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .padding(innerPadding)
                .fillMaxSize()
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // 事务类型过滤器横向滑动栏
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                items(TypeFilters) { (key, label) ->
                    val isSelected = selectedType == key
                    FilterChip(
                        selected = isSelected,
                        onClick = { selectedType = key },
                        label = { Text(label, fontSize = 12.sp) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = PrimaryBlue.copy(alpha = 0.2f),
                            selectedLabelColor = PrimaryBlue,
                            containerColor = DarkCard,
                            labelColor = TextSecondary
                        ),
                        border = FilterChipDefaults.filterChipBorder(
                            enabled = true,
                            selected = isSelected,
                            borderColor = if (isSelected) PrimaryBlue else DarkBorder
                        )
                    )
                }
            }

            // 事务列表
            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier.fillMaxSize()
            ) {
                items(filtered) { eng ->
                    EngagementCard(
                        engagement = eng,
                        onClick = { onSelectEngagement(eng.id) }
                    )
                }
            }
        }

        // 新建事务弹窗
        if (showCreateDialog) {
            var newName by remember { mutableStateOf("") }
            var newType by remember { mutableStateOf("INTERVIEW") }

            AlertDialog(
                onDismissRequest = { showCreateDialog = false },
                title = { Text("新建现场 FBE 事务", color = TextPrimary) },
                text = {
                    Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        OutlinedTextField(
                            value = newName,
                            onValueChange = { newName = it },
                            label = { Text("事务/客户名称") },
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                },
                confirmButton = {
                    Button(
                        onClick = {
                            if (newName.isNotBlank()) {
                                val newEng = EngagementUiModel(
                                    id = "eng-${System.currentTimeMillis()}",
                                    title = newName.trim(),
                                    customerName = newName.trim(),
                                    type = newType,
                                    status = "OPEN",
                                    dateStr = "今日"
                                )
                                engagements = listOf(newEng) + engagements
                                showCreateDialog = false
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = PrimaryBlue)
                    ) {
                        Text("创建", color = DarkBackground, fontWeight = FontWeight.Bold)
                    }
                },
                dismissButton = {
                    TextButton(onClick = { showCreateDialog = false }) {
                        Text("取消", color = TextSecondary)
                    }
                },
                containerColor = DarkCard
            )
        }
    }
}

@Composable
fun EngagementCard(
    engagement: EngagementUiModel,
    onClick: () -> Unit
) {
    val typeColor = when (engagement.type) {
        "INTERVIEW" -> PrimaryBlue
        "INFRA_SURVEY" -> AccentPurple
        "POC_TRACKING" -> AccentAmber
        "TROUBLESHOOTING" -> AccentRose
        else -> AccentEmerald
    }

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(DarkCard)
            .border(1.dp, DarkBorder, RoundedCornerShape(12.dp))
            .clickable(onClick = onClick)
            .padding(16.dp)
    ) {
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = engagement.title,
                    color = TextPrimary,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.SemiBold,
                    modifier = Modifier.weight(1f)
                )
                Icon(Icons.Default.ChevronRight, contentDescription = null, tint = TextMuted)
            }

            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(4.dp))
                        .background(typeColor.copy(alpha = 0.15f))
                        .border(1.dp, typeColor.copy(alpha = 0.4f), RoundedCornerShape(4.dp))
                        .padding(horizontal = 6.dp, vertical = 2.dp)
                ) {
                    Text(text = engagement.type, color = typeColor, fontSize = 11.sp, fontWeight = FontWeight.Medium)
                }

                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    Icon(Icons.Default.CalendarToday, contentDescription = null, tint = TextMuted, modifier = Modifier.size(12.dp))
                    Text(text = engagement.dateStr, color = TextMuted, fontSize = 12.sp)
                }
            }
        }
    }
}
