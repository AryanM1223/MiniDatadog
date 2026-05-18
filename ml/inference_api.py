from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import torch
import torch.nn as nn

class AnomalyDetector(nn.Module):
    def __init__(self):
        super(AnomalyDetector, self).__init__()
        self.encoder = nn.Sequential(
            nn.Linear(1, 16), nn.ReLU(), nn.Linear(16, 4)
        )
        self.decoder = nn.Sequential(
            nn.Linear(4, 16), nn.ReLU(), nn.Linear(16, 1)
        )
    def forward(self, x):
        return self.decoder(self.encoder(x))

model = AnomalyDetector()
try:
    model.load_state_dict(torch.load('autoencoder_model.pth', weights_only=True))
    model.eval() 
    print("SUCCESS: Autoencoder loaded and ready for inference.")
except Exception as e:
    print(f"Failed to load model: {e}")

app = FastAPI(title="MiniDatadog ML Engine")

class MetricPayload(BaseModel):
    value: float


ANOMALY_THRESHOLD = 0.05 

@app.post("/predict")
async def check_anomaly(metric: MetricPayload):
    try:
       
        scaled_val = (metric.value - 50) / 100.0 
        tensor_data = torch.tensor([[scaled_val]], dtype=torch.float32)

        with torch.no_grad(): 
            reconstruction = model(tensor_data)
            
        criterion = nn.MSELoss()
        mse_loss = criterion(reconstruction, tensor_data).item()

        is_anomaly = mse_loss > ANOMALY_THRESHOLD

        return {
            "metric_value": metric.value,
            "reconstruction_error": round(mse_loss, 6),
            "is_anomaly": is_anomaly
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))