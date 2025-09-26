from datetime import datetime

from fastapi import FastAPI
from pydantic import BaseModel
from ollama import chat

app = FastAPI()


class StoryMessages(BaseModel):
    messages: list[str]

@app.post("/api/continue")
async def continue_text(story: StoryMessages):
    faked_chat_history: list[dict[str, str]] = []
    for i in range(1, len(story.messages) + 1):
        faked_chat_history.insert(0,
        {
        "role": "user" if i % 2 == 0 else "assistant",
        "content": story.messages[-i],
        })
    time_before = datetime.now()
    reply = chat(
        model='nchapman/mn-12b-inferor-v0.0:latest',
        messages=faked_chat_history,
    )
    elapsed = (datetime.now() - time_before).total_seconds()
    new_entry = reply['message']['content'].strip()
    print(reply)
    if not new_entry.endswith('.'):
        new_entry = new_entry.rsplit('.', 1)[0] + '.'
    with open("cached_story.md", "w") as fw:
        for m in story.messages:
            fw.write("\n\n")
            fw.write(m)
            fw.write("\n")

        fw.write(f"\n---------\nTook {elapsed:.2f} seconds\n")
        fw.write(new_entry)
        fw.write("\n")
    return {
        "new_message": new_entry,
        "elapsed": elapsed
    }