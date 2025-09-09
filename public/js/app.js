class SmartWardrobeSimulator {
    constructor() {
        this.backendUrl = 'http://localhost:3001';
        this.serialNumber = 'SW-SIM-001';
        this.init();
    }

    init() {
        this.bindEvents();
        this.showStatusMessage('info', 'Smart Wardrobe Simulator ready');
    }
    bindEvents() {
        document.getElementById('sendHeartbeat').addEventListener('click', () => {
            this.sendHeartbeat();
        });
        document.getElementById('sendRfidScan').addEventListener('click', () => {
            this.sendRfidScan();
        });
        document.getElementById('apiKey').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendHeartbeat();
            }
        });
        document.getElementById('rfidTag').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendRfidScan();
            }
        });
    }
    getApiKey() {
        const apiKey = document.getElementById('apiKey').value.trim();
        if (!apiKey) {
            this.showStatusMessage('error', 'Please enter an API key');
            return null;
        }
        return apiKey;
    }
    getRfidTag() {
        const tag = document.getElementById('rfidTag').value.trim();
        if (!tag) {
            this.showStatusMessage('error', 'Please enter an RFID tag');
            return null;
        }
        return tag.toUpperCase();
    }
    async sendHeartbeat() {
        const apiKey = this.getApiKey();
        if (!apiKey) return;
        try {
            const response = await fetch(`${this.backendUrl}/rfid/heartbeat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey
                },
                body: JSON.stringify({
                    serialNumber: this.serialNumber,
                    timestamp: new Date().toISOString()
                })
            });
            if (response.ok) {
                const result = await response.text();
                this.showStatusMessage('success', `Heartbeat sent successfully: ${response.status}`);
                console.log('Heartbeat response:', result);
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            this.showStatusMessage('error', `Heartbeat failed: ${error.message}`);
            console.error('Heartbeat error:', error);
        }
    }
    async sendRfidScan() {
        const apiKey = this.getApiKey();
        const tagId = this.getRfidTag();
        if (!apiKey || !tagId) return;
        const detectedTags = [{
            tagId: tagId,
            event: 'detected',
            signalStrength: Math.floor(Math.random() * 50) + 50, 
            timestamp: new Date().toISOString()
        }];
        try {
            const response = await fetch(`${this.backendUrl}/rfid/scan`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey
                },
                body: JSON.stringify({
                    serialNumber: this.serialNumber,
                    detectedTags: detectedTags,
                    timestamp: new Date().toISOString()
                })
            });

            if (response.ok) {
                const result = await response.text();
                this.showStatusMessage('success', `RFID scan sent: ${tagId} (${response.status})`);
                console.log('RFID scan response:', result);
                
                // Clear the tag input for next scan
                document.getElementById('rfidTag').value = '';
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            this.showStatusMessage('error', `RFID scan failed: ${error.message}`);
            console.error('RFID scan error:', error);
        }
    }

    showStatusMessage(type, message) {
        const statusMessage = document.getElementById('statusMessage');
        statusMessage.textContent = message;
        statusMessage.className = `status-message ${type}`;
        statusMessage.classList.remove('hidden');

        setTimeout(() => {
            statusMessage.classList.add('hidden');
        }, 4000);
        statusMessage.onclick = () => {
            statusMessage.classList.add('hidden');
        };
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const simulator = new SmartWardrobeSimulator();
    window.simulator = simulator;
});