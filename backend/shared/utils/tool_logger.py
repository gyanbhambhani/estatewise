import os
import sys
import functools
import datetime
import traceback


def log_tool_call(func):
    """
    Decorator to log tool calls with UTC timestamp, tool name, and arguments.
    Logs to console and to logs.txt in the MCP server's root directory.
    """
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        # Get UTC timestamp
        timestamp = datetime.datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')
        # Tool name
        tool_name = func.__name__
        # Format args and kwargs for logging
        arg_strs = []
        if args:
            arg_strs += [repr(a) for a in args]
        if kwargs:
            arg_strs += [f"{k}={v!r}" for k, v in kwargs.items()]
        arg_str = ', '.join(arg_strs)
        # Log line
        log_line = f"[{timestamp}] {tool_name}({arg_str})"
        # Print to console
        print(log_line)
        # Determine logs.txt path (in the MCP server's directory)
        # Assume this file is imported from .../mcp-servers/<server>/tools/*.py
        # So go up 2 directories from __file__ of the wrapped function
        try:
            module_file = sys.modules[func.__module__].__file__
            mcp_dir = os.path.dirname(os.path.dirname(module_file))
            log_path = os.path.join(mcp_dir, 'logs.txt')
        except Exception:
            log_path = 'logs.txt'  # fallback
        # Write to logs.txt
        try:
            with open(log_path, 'a') as f:
                f.write(log_line + '\n')
        except Exception as e:
            print(f"[log_tool_call] Failed to write log: {e}")
        # Call the function, log exceptions if any
        try:
            return func(*args, **kwargs)
        except Exception as exc:
            tb = traceback.format_exc()
            error_line = f"[{timestamp}] {tool_name} EXCEPTION: {exc}\n{tb}"
            print(error_line)
            try:
                with open(log_path, 'a') as f:
                    f.write(error_line + '\n')
            except Exception as e:
                print(f"[log_tool_call] Failed to write exception log: {e}")
            raise
    return wrapper 