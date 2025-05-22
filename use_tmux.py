import libtmux

svr = libtmux.Server()
session = svr.new_session(session_name='story-llm')
bg_window = session.new_window(attach=False, window_name="ha in the bg")
bg_window.split()
panes = bg_window.panes
assert len(panes) == 2
panes[1].send_keys("uv sync", enter=True)
panes[1].send_keys("uv run fastapi run", enter=True)

panes[0].send_keys("cd auto-rp", enter=True)
panes[0].send_keys("npm install", enter=True)
panes[0].send_keys("npm run dev", enter=True)


