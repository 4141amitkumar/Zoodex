# python/predict.py
import sys
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np
import os

# Load model
model = tf.keras.models.load_model(os.path.join(os.path.dirname(__file__), "model.h5"))
classes = ['Elephant', 'Giraffe', 'Lion', 'Tiger', 'Zebra']  # same order as training

# Image path from CLI
img_path = sys.argv[1]

# Preprocess image
img = image.load_img(img_path, target_size=(224, 224))
img_array = image.img_to_array(img)
img_array = np.expand_dims(img_array, axis=0) / 255.0

# Predict
pred = model.predict(img_array)
predicted_class = classes[np.argmax(pred)]

print(predicted_class)
