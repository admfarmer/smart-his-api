// Node >= 25 removed buffer.SlowBuffer, which buffer-equal-constant-time (via jsonwebtoken) still uses.
const buffer = require('buffer');
if (!buffer.SlowBuffer) {
  buffer.SlowBuffer = Buffer;
}
