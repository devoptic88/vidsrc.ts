# Upstream TLS chain compatibility

The observed vidsrc.net chain on 2026-10-14 contained its leaf and Let's
Encrypt YE2, but omitted Root YE cross-signed by ISRG Root X2.

`root-ye-by-x2.pem` was downloaded with HTTPS verification enabled from:
https://letsencrypt.org/certs/gen-y/root-ye-by-x2.pem

Official chain documentation: https://letsencrypt.org/certificates/

SHA-256 certificate fingerprint:
`0F:C0:90:1C:CA:2B:AE:9E:9F:DB:B0:2D:50:D0:2F:10:94:F7:B3:66:72:08:69:91:B9:E8:97:62:6D:C4:85:F0`

Expires September 2, 2032. The startup module verifies its signature against
Node's bundled trusted roots, CA flag, and validity period before adding it
alongside the existing CA set. Certificate and hostname verification remain
enabled. No certificate downloads occur at application startup.

Remove this compatibility certificate and bootstrap once the upstream serves
a complete chain and the supported runtime can verify it without assistance.
