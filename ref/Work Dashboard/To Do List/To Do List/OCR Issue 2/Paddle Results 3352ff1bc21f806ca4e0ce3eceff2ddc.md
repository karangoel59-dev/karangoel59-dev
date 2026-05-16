# Paddle Results

[_OCR Service Code Review .pdf](Paddle%20Results/_OCR_Service_Code_Review_.pdf)

## Optimisation added

- **Engine:** PaddleOCR (CPU Mode)
- **Optimisations Enabled:** `enable_mkldnn=True (optimise math on intel cpu)`
- **Concurrency:** `cpu_threads=2`
- **Detection Limit:** `det_limit_side_len=736 (maximum length of the longer side)`

## For App

- Adding OCR in seperate celery queue

| **Action** | **Individual Spike** | **Total RAM** | **Status** |
| --- | --- | --- | --- |
| Script Init | N/A | ~873.11 MB | Baseline |
| Model Initialisation | +309.51 MB | 1182.62 MB | **Critical Jump** |
| Image Processing | +199.42 MB | 1394.70 MB | Normal |
| Dense Text | **+432.99 MB** | 1827.69 MB | **Peak Load** |
| Simple Text | +1.46 MB | 1832.45 MB | Plateaued |
| Buffer Cleanup | -0.17 MB | 1832.29 MB | Stable |

| **Event** | **Spike Amount** | **Total Process RAM** | **Cause** |
| --- | --- | --- | --- |
| **Initial Load** | +309.51 MB | 1.18 GB | Paddle Models (Weights) |
| **Dense Page** | **+432.99 MB** | **1.83 GB** | Peak Tensor Allocation |
|  |  |  |  |
- **Service Core:** ~870 MB (Static)
- **Paddle Models:** ~300 MB
- **Image Processing:** ~660 MB
- **Total Process RAM:** **1.83 GB**

Peak Load : 1.83 GB

Intermediate: 1.39 GB