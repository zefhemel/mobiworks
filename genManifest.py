import commands
import os.path
import sys

allfiles = commands.getoutput('find .').splitlines()
newfiles = []
for f in allfiles:
    if f.startswith("./."):
        continue
    if os.path.isdir(f):
        continue
    if f.endswith('.py') or f.endswith('.manifest'):
        continue
    newfiles.append(f[2:])
fp = open('index.manifest', 'w')
fp.write("CACHE MANIFEST\n\n")
for f in newfiles:
    fp.write("%s\n" % f)
fp.close()
