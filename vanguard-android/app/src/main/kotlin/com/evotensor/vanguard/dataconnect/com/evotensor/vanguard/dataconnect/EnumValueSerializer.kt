package com.evotensor.vanguard.dataconnect

import com.evotensor.vanguard.dataconnect.EnumValue.Known
import com.evotensor.vanguard.dataconnect.EnumValue.Unknown
import kotlinx.serialization.KSerializer
import kotlinx.serialization.descriptors.PrimitiveKind
import kotlinx.serialization.descriptors.PrimitiveSerialDescriptor
import kotlinx.serialization.descriptors.SerialDescriptor
import kotlinx.serialization.encoding.Decoder
import kotlinx.serialization.encoding.Encoder

/**
 * A [KSerializer] implementation for [EnumValue].
 *
 * @param values The values of the enum to deserialize; for example, for an enum named `Foo` this
 * value should be `Foo.entries` or `Foo.values()`.
 */
public open class EnumValueSerializer<T : Enum<T>>(values: Iterable<T>) :
  KSerializer<EnumValue<T>> {

  override val descriptor: SerialDescriptor =
    PrimitiveSerialDescriptor("com.evotensor.vanguard.dataconnect.EnumValue", PrimitiveKind.STRING)

  private val enumValueByStringValue: Map<String, T> = buildMap {
    for (value in values) {
      val oldValue = put(value.name, value)
      require(oldValue === null) { "duplicate value.name in values: ${value.name}" }
    }
  }

  /**
   * Deserializes an [EnumValue] from the given decoder.
   *
   * If the decoded string is equal to the [Enum.name] of one of the values given to the constructor
   * then [Known] is returned with that value; otherwise, [Unknown] is returned.
   */
  override fun deserialize(decoder: Decoder): EnumValue<T> {
    val stringValue = decoder.decodeString()
    val enumValue = enumValueByStringValue.get(stringValue) ?: return Unknown(stringValue)
    return Known(enumValue)
  }

  /** Serializes the given [EnumValue] to the given encoder. */
  override fun serialize(encoder: Encoder, value: EnumValue<T>) {
    encoder.encodeString(value.stringValue)
  }
}
