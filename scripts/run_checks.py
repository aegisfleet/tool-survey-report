import sys
import subprocess
import os

def main():
    args = sys.argv[1:]
    
    # 1. Run link checker
    cmd1 = [sys.executable, "scripts/check_links.py"] + args
    print(f"Running link checker: {' '.join(cmd1)}")
    res1 = subprocess.run(cmd1, env=dict(os.environ, PYTHONPATH="."))
    
    # 2. Run Mermaid syntax checker
    cmd2 = [sys.executable, "scripts/check_mermaid.py"] + args
    print(f"\nRunning Mermaid syntax checker: {' '.join(cmd2)}")
    res2 = subprocess.run(cmd2, env=dict(os.environ, PYTHONPATH="."))
    
    # Return error if any of the checks failed
    if res1.returncode != 0:
        print("\nLink check failed.")
        sys.exit(res1.returncode)
    elif res2.returncode != 0:
        print("\nMermaid syntax check failed.")
        sys.exit(res2.returncode)
        
    print("\nAll checks passed successfully.")
    sys.exit(0)

if __name__ == "__main__":
    main()
