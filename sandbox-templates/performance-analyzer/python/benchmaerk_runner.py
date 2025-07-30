import time
import json
import random
# Ajanın 'original_code.py' içinde 'main' adında bir fonksiyon oluşturduğunu varsayıyoruz.
from original_code import main as original_function
from improved_code import main as improved_function

test_sizes = [100, 1000, 5000]
results = []
def generate_test_data(size):
    return [random.randint(0, size) for _ in range(size)]

for size in test_sizes:
    test_data = generate_test_data(size)

    start_original = time.perf_counter()
    original_function(list(test_data))
    end_original = time.perf_counter()

    start_improved = time.perf_counter()
    improved_function(list(test_data))
    end_improved = time.perf_counter()

    results.append({
        "size": size,
        "original": (end_original - start_original) * 1000,
        "improved": (end_improved - start_improved) * 1000
    })

print(json.dumps({ "results": results, "unit": "ms" }))