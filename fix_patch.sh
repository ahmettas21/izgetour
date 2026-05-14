#!/bin/bash
cd /home/turk/projects/izgetour

# Tüm client-and-server-references.js dosyalarını bul
for f in $(find node_modules/next -name "client-and-server-references.js" 2>/dev/null | grep -v node_modules/next/node_modules); do
    echo "Patching: $f"
    # isServerReference fonksiyonuna null check ekle
    sed -i 's/export function isServerReference(value) {/export function isServerReference(value) {\n    if (value == null) return false;/' "$f"
done

# Minified sürümlerde (client-and-server-references.js)
for f in $(find node_modules/next -name "client-and-server-references*.js" 2>/dev/null | grep -v node_modules/next/node_modules); do
    echo "Fixing minified: $f"
    # Direct: return value.$$typeof === Symbol.for('react.server.reference')
    sed -i 's/value\.\$\$typeof===Symbol\.for("react\.server\.reference")/void 0===value?false:value.$$typeof===Symbol.for("react.server.reference")/' "$f"
    sed -i "s/value\.\\\$\\\$typeof===Symbol\.for('react\.server\.reference')/void 0===value?false:value.\\\$\\\$typeof===Symbol.for('react.server.reference')/" "$f"
done

echo "Done"
