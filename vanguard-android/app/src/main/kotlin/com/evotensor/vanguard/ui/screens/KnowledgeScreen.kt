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
import androidx.compose.material.icons.filled.Book
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Sparkles
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.evotensor.vanguard.ui.theme.*

data class KnowledgeUiModel(
    val id: String,
    val title: String,
    val summary: String,
    val category: String,
    val content: String,
    val confidence: Float
)

val SampleKnowledgeList = listOf(
    KnowledgeUiModel(
        id = "k-1",
        title = "B2B 决策者隐性顾虑：管理控制权丧失",
        summary = "客户表面抱怨系统复杂，实际担心自动化剥夺团队控制权。",
        category = "CUSTOMER_PATTERN",
        content = "在访谈中，当中层管理人员反复强调'新系统过于复杂、员工可能学不会'时，通常不是技术能力问题，而是担心新自动化平台削弱其团队管理权限。应对策略：重点展示角色权限配置（RBAC）与人工审核流控制机制，强调系统是管理赋能而非替代。",
        confidence = 0.92f
    ),
    KnowledgeUiModel(
        id = "k-2",
        title = "高频量化机构痛点：实盘配置热更新容错边界",
        summary = "量化团队对配置变更误操作零容忍，强依赖双人复核与快照回滚。",
        category = "INDUSTRY_BACKGROUND",
        content = "量化回测与实盘交接中，参数漏配与覆盖是头号穿仓隐患。必须在交付工具中引入 TOTP 动态码双人二次校验机制与 Git 版本快照自动 Diff 比对功能。",
        confidence = 0.95f
    ),
    KnowledgeUiModel(
        id = "k-3",
        title = "FBE 现场访谈引导技巧：从显性抱怨追溯 JTBD",
        summary = "客户抱怨回测慢时，核心目标往往是确保早上开盘前策略就绪。",
        category = "METHODOLOGY",
        content = "运用 5-Whys 引导法。当工程师说'我们需要分布式跑 100 个节点'时，探寻'如果只要 30 分钟出结果，是否单机高吞吐也满足？'，从而将客户从特定实现引导回真实目标。",
        confidence = 0.88f
    ),
    KnowledgeUiModel(
        id = "k-4",
        title = "传统金融客户国产化与私有部署合规约束",
        summary = "国有银行与头部券商严禁直连公网 AI API，需采用隔离网关或专线。",
        category = "CASE_STUDY",
        content = "某国有券商 PoC 交付经验：现场环境统一为 Rocky Linux 9，公网物理隔离。Agent 模型推断需通过内部白名单正向代理中转。",
        confidence = 0.96f
    )
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun KnowledgeScreen(
    modifier: Modifier = Modifier
) {
    var searchQuery by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf("ALL") }
    var expandedId by remember { mutableStateOf<String?>(null) }

    val categories = listOf(
        "ALL" to "全部知识",
        "CUSTOMER_PATTERN" to "客户模式",
        "INDUSTRY_BACKGROUND" to "行业背景",
        "METHODOLOGY" to "访谈方法",
        "CASE_STUDY" to "交付案例"
    )

    val filtered = remember(searchQuery, selectedCategory) {
        SampleKnowledgeList.filter { item ->
            val matchCat = selectedCategory == "ALL" || item.category == selectedCategory
            val matchQ = searchQuery.isBlank() || 
                    item.title.contains(searchQuery, ignoreCase = true) || 
                    item.content.contains(searchQuery, ignoreCase = true)
            matchCat && matchQ
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Icon(Icons.Default.Book, contentDescription = null, tint = PrimaryBlue)
                        Text("团队原子化知识库", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = DarkBackground)
            )
        },
        containerColor = DarkBackground,
        modifier = modifier
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .padding(innerPadding)
                .fillMaxSize()
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // 搜索输入框
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                placeholder = { Text("搜索原子知识、经验模式或隐性诉求...", color = TextMuted, fontSize = 13.sp) },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, tint = TextSecondary) },
                singleLine = true,
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(10.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedContainerColor = DarkCard,
                    unfocusedContainerColor = DarkCard,
                    focusedBorderColor = PrimaryBlue,
                    unfocusedBorderColor = DarkBorder,
                    focusedTextColor = TextPrimary,
                    unfocusedTextColor = TextPrimary
                )
            )

            // 分类 FilterChip 滑动栏
            LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                items(categories) { (key, label) ->
                    val isSelected = selectedCategory == key
                    FilterChip(
                        selected = isSelected,
                        onClick = { selectedCategory = key },
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

            // 知识卡片列表
            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(10.dp),
                modifier = Modifier.fillMaxSize()
            ) {
                items(filtered) { item ->
                    val isExpanded = expandedId == item.id
                    val catColor = when (item.category) {
                        "CUSTOMER_PATTERN" -> AccentPurple
                        "INDUSTRY_BACKGROUND" -> PrimaryBlue
                        "METHODOLOGY" -> AccentAmber
                        else -> AccentEmerald
                    }

                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(12.dp))
                            .background(DarkCard)
                            .border(1.dp, DarkBorder, RoundedCornerShape(12.dp))
                            .clickable { expandedId = if (isExpanded) null else item.id }
                            .padding(14.dp)
                    ) {
                        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = item.title,
                                    color = TextPrimary,
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    modifier = Modifier.weight(1f)
                                )
                                Box(
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(4.dp))
                                        .background(catColor.copy(alpha = 0.15f))
                                        .padding(horizontal = 6.dp, vertical = 2.dp)
                                ) {
                                    Text(item.category, color = catColor, fontSize = 10.sp, fontWeight = FontWeight.Medium)
                                }
                            }

                            Text(
                                text = item.summary,
                                color = TextSecondary,
                                fontSize = 13.sp,
                                lineHeight = 18.sp
                            )

                            if (isExpanded) {
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clip(RoundedCornerShape(8.dp))
                                        .background(DarkBackground)
                                        .border(1.dp, catColor.copy(alpha = 0.3f), RoundedCornerShape(8.dp))
                                        .padding(10.dp)
                                ) {
                                    Text(
                                        text = item.content,
                                        color = TextPrimary,
                                        fontSize = 12.sp,
                                        lineHeight = 17.sp
                                    )
                                }
                            }

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                                ) {
                                    Icon(Icons.Default.Sparkles, contentDescription = null, tint = catColor, modifier = Modifier.size(12.dp))
                                    Text("置信度 ${(item.confidence * 100).toInt()}%", color = TextMuted, fontSize = 11.sp)
                                }
                                Text(
                                    text = if (isExpanded) "收起" else "展开详情",
                                    color = PrimaryBlue,
                                    fontSize = 12.sp
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}
