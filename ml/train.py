import torch
import torch.nn as nn
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler
from influxdb_client import InfluxDBClient

#remove hardcoded env
INFLUX_URL = "http://localhost:8086"
INFLUX_TOKEN = "super-secret-token"  
INFLUX_ORG = "minidatadog"             
INFLUX_BUCKET = "logs"


class AnomalyDetector(nn.Module):
    def __init__(self):
        super(AnomalyDetector, self).__init__()
        self.encoder = nn.Sequential(
            nn.Linear(1, 16),
            nn.ReLU(),
            nn.Linear(16, 4) 
        )
        self.decoder = nn.Sequential(
            nn.Linear(4, 16),
            nn.ReLU(),
            nn.Linear(16, 1)
        )

    def forward(self, x):
        encoded = self.encoder(x)
        decoded = self.decoder(encoded)
        return decoded


def get_training_data():
    print("Extracting 7 days of telemetry from InfluxDB...")
    client = InfluxDBClient(url=INFLUX_URL, token=INFLUX_TOKEN, org=INFLUX_ORG)
    
    query = f"""
    from(bucket: "{INFLUX_BUCKET}") 
      |> range(start: -7d)
      |> filter(fn: (r) => r["_measurement"] == "metrics")
      |> filter(fn: (r) => r["name"] == "response_time")
      |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
    """
    
    df = client.query_api().query_data_frame(query)
    client.close()
    
    if df.empty:
        raise ValueError("No data found! Check your InfluxDB bucket and time range.")
        
    print(f"Extraction complete. Found {len(df)} metrics.")
    
    scaler = MinMaxScaler()
    scaled_values = scaler.fit_transform(df[['value']])
    
    tensor_data = torch.tensor(scaled_values, dtype=torch.float32).view(-1, 1)
    return tensor_data


def train_model(data):
    model = AnomalyDetector()
    criterion = nn.MSELoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=0.01)
    
    epochs = 200
    losses = []
    
    print("Beginning Training Loop...")
    for epoch in range(epochs):
        predictions = model(data)
        
        loss = criterion(predictions, data)
        losses.append(loss.item())
        
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        
        if (epoch + 1) % 20 == 0:
            print(f'Epoch [{epoch + 1}/{epochs}], Loss: {loss.item():.6f}')
            
    return losses


if __name__ == "__main__":
    try:
        training_data = get_training_data()
        
        print("Starting training phase...")
        
        model = AnomalyDetector()
        criterion = nn.MSELoss()
        optimizer = torch.optim.Adam(model.parameters(), lr=0.01)
        
        epochs = 200
        losses = []
        
        for epoch in range(epochs):
            predictions = model(training_data)
            loss = criterion(predictions, training_data)
            losses.append(loss.item())
            
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()
            
            if (epoch + 1) % 20 == 0:
                print(f'Epoch [{epoch + 1}/{epochs}], Loss: {loss.item():.6f}')
        
        torch.save(model.state_dict(), 'autoencoder_model.pth')
        print("\nSUCCESS: Model weights securely saved to 'autoencoder_model.pth'")
        
        print("Rendering Learning Curve...")
        plt.plot(losses, color='#00d1b2')
        plt.title('Autoencoder: Error Correction Learning Curve')
        plt.xlabel('Epoch')
        plt.ylabel('Loss (MSE)')
        plt.grid(True, linestyle='--', alpha=0.7)
        plt.show()
        
    except Exception as e:
        print(f"Error during execution: {e}")
    try:
        training_data = get_training_data()
        
        training_losses = train_model(training_data)
        
        print("Training complete. Rendering Learning Curve...")
        plt.plot(training_losses, color='#00d1b2')
        plt.title('Autoencoder: Error Correction Learning Curve')
        plt.xlabel('Epoch')
        plt.ylabel('Loss (MSE)')
        plt.grid(True, linestyle='--', alpha=0.7)
        plt.show()
        torch.save(model.state_dict(), 'autoencoder_model.pth')
        print("Model weights securely saved to autoencoder_model.pth")
    except Exception as e:
        print(f"Error during execution: {e}")