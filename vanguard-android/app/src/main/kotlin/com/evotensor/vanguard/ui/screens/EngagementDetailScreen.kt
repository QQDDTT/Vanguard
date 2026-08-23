package com.evotensor.vanguard.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.evotensor.vanguard.ui.components.AudioRecorderComponent
import com.evotensor.vanguard.ui.theme.*

data class DimensionInsight(
    val title: String,
    val items: List<String>,
    val color: Color
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EngagementDetailScreen(
    engagementId: String,
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    var transcript by remember { mutableStateOf("") }
    var isAnalyzing by remember { mutableStateOf(false) }
    var capturedAudioName by remember { mutableStateOf<String?>(null) }
    var insights by remember { mutableStateOf<List<DimensionInsight>?>(null) }

    val sampleInsights = listOf(
        DimensionInsight("显性功能诉求 (Functional)", listOf("量化回测任务断点续跑与自动重试", "多版本策略参数差异可视化比对"), PrimaryBlue),
        DimensionInsight("核心痛点卡点 (Pain Points)", listOf("盘后回测耗时 6 小时网络抖动全量重跑", "人工肉眼比对参数极易漏配实盘穿仓"), AccentRose),
        DimensionInsight("待办任务 (JTBD)", listOf("保障量化研发流水线开盘前 100% 确定性就绪", "发布误操作率归零"), AccentAmber),
        DimensionInsight("隐性潜在欲望 (Latent Desires)", listOf("构建完全无人值守、高弹性分布式回测集群", "全链路快照溯源"), AccentPurple),
        DimensionInsight("合规约束边界 (Constraints)", listOf("全内网私有化隔离部署，严禁直连公网 API", "底层必须采用 Rust/C++，宿主为 Rocky Linux 9"), TextSecondary)
    )

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("现场事务详情与推断", color = TextPrimary, fontSize = 17.sp, fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "返回", tint = TextPrimary)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = DarkBackground)
            )
        },
        containerColor = DarkBackground,
        modifier = modifier
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .padding(innerPadding)
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // 现场录音采集组件
            item {
                AudioRecorderComponent(
                    onAudioCaptured = { fileName, duration ->
                        capturedAudioName = "$fileName (时长: ${duration}s)"
                        transcript += "\n[现场录音已挂载: $fileName]"
                    }
                )
            }

            if (capturedAudioName != null) {
                item {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(8.dp))
                            .background(AccentEmerald.copy(alpha = 0.1f))
                            .border(1.dp, AccentEmerald.copy(alpha = 0.3f), RoundedCornerShape(8.dp))
                            .padding(12.dp)
                    ) {
                        Text(
                            text = "📎 已挂载录音：$capturedAudioName",
                            color = AccentEmerald,
                            fontSize = 13.sp
                        )
                    }
                }
            }

            // 现场访谈笔记输入框
            item {
                Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    Text("📝 现场访谈速记 / 素材转录", color = TextSecondary, fontSize = 13.sp)
                    OutlinedTextField(
                        value = transcript,
                        onValueChange = { transcript = it },
                        placeholder = { Text("输入客户痛点、机房拓扑约束或现场速记...", color = TextMuted) },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(110.dp),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedContainerColor = DarkCard,
                            unfocusedContainerColor = DarkCard,
                            focusedBorderColor = PrimaryBlue,
                            unfocusedBorderColor = DarkBorder,
                            focusedTextColor = TextPrimary,
                            unfocusedTextColor = TextPrimary
                        ),
                        shape = RoundedCornerShape(10.dp)
                    )
                }
            }

            // 启动 Agent 推断按钮
            item {
                Button(
                    onClick = {
                        isAnalyzing = true
                        insights = sampleInsights
                    },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(10.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = PrimaryBlue)
                ) {
                    Icon(Icons.Default.AutoAwesome, contentDescription = null, tint = DarkBackground)
                    Spacer(Modifier.width(8.dp))
                    Text(
                        text = if (isAnalyzing) "Agent 深度分析中..." else "启动 AI 七维度需求推断",
                        color = DarkBackground,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            // 七维度洞察卡片展示
            insights?.let { list ->
                item {
                    Text(
                        text = "✨ 七维度需求洞察矩阵",
                        color = PrimaryBlue,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(top = 8.dp)
                    )
                }

                items(list) { dim ->
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(10.dp))
                            .background(DarkCard)
                            .border(1.dp, dim.color.copy(alpha = 0.35f), RoundedCornerShape(10.dp))
                            .padding(14.dp)
                    ) {
                        Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                            Text(
                                text = dim.title,
                                color = dim.color,
                                fontSize = 14.sp,
                                fontWeight = FontWeight.SemiBold
                            )
                            dim.items.forEach { itemText ->
                                Row(
                                    verticalAlignment = Alignment.Top,
                                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                                ) {
                                    Text("•", color = dim.color)
                                    Text(itemText, color = TextPrimary, fontSize = 13.sp, lineHeight = 18.sp)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
