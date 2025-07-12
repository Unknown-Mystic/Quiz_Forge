from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

model_name = "lmqg/t5-base-squad-qg-ae"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

local_path = "C:/Users/gowri/Desktop/intel/lmqg_t5_qg_ae_model"
tokenizer.save_pretrained(local_path)
model.save_pretrained(local_path)
