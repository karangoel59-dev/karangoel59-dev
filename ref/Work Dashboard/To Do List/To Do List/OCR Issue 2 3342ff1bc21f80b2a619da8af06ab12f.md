---
Task: "OCR Issue 2"
Date: "April 1, 2026 → April 4, 2026"
LINK: "https://chat360-jira.atlassian.net/browse/AA-115"
Task Type: "Development"
Status: "Yes"
---
# OCR Issue 2


- Create a Queue in Celery
- Check for Paddle OCR optimisation
- Add monitor for me

```
import tracemalloc

def profile_ocr_memory(image_bytes):
    tracemalloc.start()

    result = engine.ocr(image_bytes, cls=True)

    current, peak = tracemalloc.get_traced_memory()
    print(f"Current memory usage: {current / 10**6:.2f}MB")
    print(f"Peak memory usage: {peak / 10**6:.2f}MB")

    snapshot = tracemalloc.take_snapshot()
    top_stats = snapshot.statistics('lineno')

    print("[ Top 3 Memory Consumers ]")
    for stat in top_stats[:3]:
        print(stat)

    tracemalloc.stop()
```

```
import psutil
import os

def get_process_memory():
    process = psutil.Process(os.getpid())
    return process.memory_info().rss / 1024 / 1024  # Convert to MB

@app.task
def ocr_task(file_path):
    mem_before = get_process_memory()

    # Run PaddleOCR
    result = engine.ocr(file_path)

    mem_after = get_process_memory()
    print(f"Memory Spike: {mem_after - mem_before:.2f} MB")
    print(f"Total Process RAM: {mem_after:.2f} MB")
```

[Paddle Results](OCR%20Issue%202/Paddle%20Results%203352ff1bc21f806ca4e0ce3eceff2ddc.md)
