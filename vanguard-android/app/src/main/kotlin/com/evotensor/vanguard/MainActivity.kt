package com.evotensor.vanguard

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Book
import androidx.compose.material.icons.filled.FolderSpecial
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import com.evotensor.vanguard.ui.screens.EngagementDetailScreen
import com.evotensor.vanguard.ui.screens.HomeScreen
import com.evotensor.vanguard.ui.screens.KnowledgeScreen
import com.evotensor.vanguard.ui.screens.OfflineDraftsScreen
import com.evotensor.vanguard.ui.theme.DarkBackground
import com.evotensor.vanguard.ui.theme.DarkCard
import com.evotensor.vanguard.ui.theme.PrimaryBlue
import com.evotensor.vanguard.ui.theme.TextSecondary
import com.evotensor.vanguard.ui.theme.VanguardTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            VanguardTheme {
                MainAppHost()
            }
        }
    }
}

@Composable
fun MainAppHost() {
    var currentTab by remember { mutableStateOf(0) } // 0: 看板, 1: 知识库
    var activeEngagementId by remember { mutableStateOf<String?>(null) }
    var showDraftsScreen by remember { mutableStateOf(false) }

    Scaffold(
        bottomBar = {
            if (activeEngagementId == null && !showDraftsScreen) {
                NavigationBar(
                    containerColor = DarkCard,
                    contentColor = TextSecondary
                ) {
                    NavigationBarItem(
                        selected = currentTab == 0,
                        onClick = { currentTab = 0 },
                        icon = { Icon(Icons.Default.FolderSpecial, contentDescription = "现场看板") },
                        label = { Text("现场看板") },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = PrimaryBlue,
                            selectedTextColor = PrimaryBlue,
                            indicatorColor = PrimaryBlue.copy(alpha = 0.15f)
                        )
                    )
                    NavigationBarItem(
                        selected = currentTab == 1,
                        onClick = { currentTab = 1 },
                        icon = { Icon(Icons.Default.Book, contentDescription = "原子知识库") },
                        label = { Text("知识库") },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = PrimaryBlue,
                            selectedTextColor = PrimaryBlue,
                            indicatorColor = PrimaryBlue.copy(alpha = 0.15f)
                        )
                    )
                }
            }
        },
        containerColor = DarkBackground,
        modifier = Modifier.fillMaxSize()
    ) { innerPadding ->
        if (showDraftsScreen) {
            OfflineDraftsScreen(
                onBack = { showDraftsScreen = false },
                modifier = Modifier.padding(innerPadding)
            )
        } else if (activeEngagementId != null) {
            EngagementDetailScreen(
                engagementId = activeEngagementId!,
                onBack = { activeEngagementId = null },
                modifier = Modifier.padding(innerPadding)
            )
        } else {
            when (currentTab) {
                0 -> HomeScreen(
                    onSelectEngagement = { id -> activeEngagementId = id },
                    onOpenDrafts = { showDraftsScreen = true },
                    modifier = Modifier.padding(innerPadding)
                )
                1 -> KnowledgeScreen(
                    modifier = Modifier.padding(innerPadding)
                )
            }
        }
    }
}
