function toBoolean (value) {
    switch (typeof value) {
    case 'boolean':
        return value;
    case 'string':
        return value.toLowerCase() === 'true' || value === '1';
    default:
        return false;
    }
}

export function getBoolean (name) {
    return toBoolean(process.env[name]);
}

function getString (key, def) {
    return process.env[key] ?? def;
}

export function getStringIn (key, values, def) {
    const re = new RegExp(values.join('|'), 'i');
    if (def && !re.test(def.toString())) {
        const valueAsString = values.join(', ');
        console.error(`${def} is not a member of ${valueAsString}`);
    }
    const value = getString(key);
    if (!value) { return def; }
    return re.test(value) ? value : def;
}

export function getKeyOf (key, obj, defOrTransform, transform) {
    let value;
    let def;
    if (typeof defOrTransform === 'function') {
        transform = defOrTransform;
    } else {
        def = defOrTransform;
    }
    if (def === undefined) {
        value = getStringIn(key, Object.keys(obj));
    } else {
        if (transform) { def = transform(def); }
        value = getStringIn(key, Object.keys(obj), def);
    }
    if (!value) { return; }
    if (typeof transform === 'function') { value = transform(value); }
    if (Object.keys(obj).includes(value)) { return value; }
}
