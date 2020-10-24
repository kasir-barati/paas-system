const spawn = require('./spawn');

async function inUsePorts() {
    const result = await spawn.execute("ss -ntl | awk '{print $4}' | cut -d':' -f 2 | grep ^[1-9] | sort -n");

    return { 'ports': result.split('\n') };
};

async function unUsePort(start, end) {
    start = start + (Math.ceil(Math.random() * 1000) + Math.ceil(Math.random() * 1000));
    const { ports } = await inUsePorts();
    const portsAboveTheStart = ports.filter(p => {
        if (p >= start && p <= end) return p;
    });

    for (let port = start; port < end; port++) {
        if (portsAboveTheStart.includes(String(port))) continue;
        else return port;
    };
};

module.exports = {
    unUsePort, inUsePorts
};