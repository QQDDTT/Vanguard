package com.evotensor.vanguard.ui.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material.icons.filled.Stop
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.evotensor.vanguard.ui.theme.*
import kotlinx.coroutines.delay

enum class RecordingState {
    IDLE,
    RECORDING,
    RECORDED
}

@Composable
fun AudioRecorderComponent(
    onAudioCaptured: (fileName: String, durationSeconds: Int) -> Unit,
    modifier: Modifier = Modifier
) {
    var state by remember { mutableStateOf(RecordingState.IDLE) }
    var seconds by remember { mutableStateOf(0) }

    // 录音计时器
    LaunchedEffect(state) {
        if (state == RecordingState.RECORDING) {
            seconds = 0
            while (state == RecordingState.RECORDING) {
                delay(1000L)
                seconds += 1
            }
        }
    }

    // 录音中呼吸灯动画
    val infiniteTransition = rememberInfiniteTransition(label = "pulse")
    val pulseScale by infiniteTransition.animateFloat(
        initialValue = 1f,
        targetValue = if (state == RecordingState.RECORDING) 1.25f else 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(800, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "scale"
    )

    Column(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(14.dp))
            .background(DarkCard)
            .border(1.dp, DarkBorder, RoundedCornerShape(14.dp))
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "🎙️ FBE 现场录音采集",
                color = TextPrimary,
                fontSize = 15.sp,
                fontWeight = androidx.compose.ui.text.font.FontWeight.SemiBold
            )

            if (state == RecordingState.RECORDING) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(10.dp)
                            .clip(CircleShape)
                            .background(AccentRose)
                    )
                    Text(
                        text = String.format("%02d:%02d 录音中", seconds / 60, seconds % 60),
                        color = AccentRose,
                        fontSize = 13.sp,
                        fontWeight = androidx.compose.ui.text.font.FontWeight.Medium
                    )
                }
            } else if (state == RecordingState.RECORDED) {
                Text(
                    text = String.format("时长 %02d:%02d", seconds / 60, seconds % 60),
                    color = AccentEmerald,
                    fontSize = 13.sp
                )
            }
        }

        // 录音主按钮与波形示意
        when (state) {
            RecordingState.IDLE -> {
                Button(
                    onClick = { state = RecordingState.RECORDING },
                    colors = ButtonDefaults.buttonColors(containerColor = PrimaryBlue),
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Icon(Icons.Default.Mic, contentDescription = null, tint = DarkBackground)
                    Spacer(Modifier.width(8.dp))
                    Text("开始现场录音", color = DarkBackground, fontWeight = androidx.compose.ui.text.font.FontWeight.Bold)
                }
            }

            RecordingState.RECORDING -> {
                Button(
                    onClick = { state = RecordingState.RECORDED },
                    colors = ButtonDefaults.buttonColors(containerColor = AccentRose),
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .scale(pulseScale)
                ) {
                    Icon(Icons.Default.Stop, contentDescription = null, tint = Color.White)
                    Spacer(Modifier.width(8.dp))
                    Text("停止录音", color = Color.White, fontWeight = androidx.compose.ui.text.font.FontWeight.Bold)
                }
            }

            RecordingState.RECORDED -> {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    OutlinedButton(
                        onClick = { state = RecordingState.IDLE },
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Icon(Icons.Default.Delete, contentDescription = null, tint = AccentRose)
                        Spacer(Modifier.width(4.dp))
                        Text("重录", color = AccentRose)
                    }

                    Button(
                        onClick = {
                            onAudioCaptured("site_audio_${System.currentTimeMillis()}.m4a", seconds)
                            state = RecordingState.IDLE
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = AccentEmerald),
                        modifier = Modifier.weight(1.5f),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Icon(Icons.Default.Check, contentDescription = null, tint = DarkBackground)
                        Spacer(Modifier.width(6.dp))
                        Text("挂载至事务", color = DarkBackground, fontWeight = androidx.compose.ui.text.font.FontWeight.Bold)
                    }
                }
            }
        }
    }
}
