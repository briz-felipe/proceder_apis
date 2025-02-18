const SftpClient = require('ssh2-sftp-client');

exports.listDir = async (req, res) => {
    const sftp = new SftpClient();
    const { host, port, username, password, path } = req.query;

    try {
        await sftp.connect({ host, port, username, password });
        const list = await sftp.list(path);
        res.json(list);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        sftp.end();
    }
};