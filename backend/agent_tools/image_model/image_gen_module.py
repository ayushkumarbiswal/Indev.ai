from diffusers import DiffusionPipeline
from langchain.tools import tool
import torch

from system_prompt.negative_prompt import negative_prompt_generation
from system_prompt.business_model import business_model_prompt 
from database.DatabaseManager import db_manager


@tool
def img_pipeline(startup_profile):
    """ Image Generating tool  """

    try:
        negative_prompt = negative_prompt_generation()
        business_model = business_model_prompt()
        num_inference_steps = 25
        height = 512
        width = 512

        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
        img_pipe = DiffusionPipeline.from_pretrained(
            "stabilityai/stable-diffusion-xl-base-1.0",
            torch_dtype=torch.float16 if device == "cuda" else torch.float32
        ).to(device)    
        
        prompt = business_model(startup_profile)

        image = img_pipe(
            prompt,
            negative_prompt=negative_prompt,
            num_inference_steps = num_inference_steps,
            guidance_scale = 7.5,
            height= height,
            width = width
            ).images[0]

        return image
    except Exception as e:
        raise ValueError(f" :( Error in Generating Image: {e} ")