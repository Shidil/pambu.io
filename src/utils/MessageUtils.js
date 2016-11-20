export default class MessageUtils {
  writeInt24(offset, data, integer) {
    let byte1;
    let byte2;
    let byte3;
    let number = Math.floor(integer);

    if (number > 16777215) {
      throw new Error('Int24 out of bound');
    }

    byte1 = number >> 16 & 0xFF;
    byte2 = number >> 8 & 0xFF;
    byte3 = number & 0xFF;
    data[offset] = byte1;
    data[offset + 1] = byte2;
    data[offset + 2] = byte3;
    return 3;
  }

  writeInt16(offset, data, integer) {
    let byte1;
    let byte2;
    let number = Math.floor(integer);

    if (number > 65535) {
      throw new Error('Int16 out of bound. Current number: ' + number);
    }

    byte1 = number >> 8 & 0xFF;
    byte2 = number & 0xFF;
    data[offset] = byte1;
    data[offset + 1] = byte2;
    return 2;
  }

  writeInt8(offset, data, integer) {
    let byte1;
    let number = Math.floor(integer);

    if (number > 255) {
      throw new Error('Int8 out of bound. Current Number: ' + number);
    }

    byte1 = number & 0xFF;
    data[offset] = byte1;
    return 1;
  }

  writeString(offset, data, string) {
    let i = 0;
    while (i < string.length) {
      this.writeInt8(offset + i, data, string.charCodeAt(i));
      i = i + 1;
    }
    return string.length;
  }

  readInt8(offset, data) {
    return data[offset];
  }

  readInt24(offset, data) {
    let byte1;
    let byte2;
    let byte3;
    let int;

    byte1 = data[offset];
    byte2 = data[offset + 1];
    byte3 = data[offset + 2];
    int = byte1 << 16 | byte2 << 8 | byte3;
    return int;
  }
  readString(offset, data, length) {
    let i = offset;
    let string = '';

    while (i < length) {
      string = string + String.fromCharCode(data[i]);
      i = i + 1;
    }
    return string;
  }
}
