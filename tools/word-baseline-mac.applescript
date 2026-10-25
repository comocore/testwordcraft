-- Word baseline on a Mac (README.md §3.4): opens every generated .docx in Word,
-- saves it as a Word document into corpus/docx and exports a PDF into corpus/reference/word-mac.
-- Checking each file against its "Expected" line is done afterwards, by a person, on the saved copies.
--
--   osascript tools/word-baseline-mac.applescript "$PWD/corpus"
--   osascript tools/word-baseline-mac.applescript "$PWD/corpus" DX-TBL-02.docx   (start from that file)
--
-- Word asks once per folder for permission to read and write it; click "Grant Access".
-- Not tested by us. If it fails, open, save and export the files by hand.

on run argv
	set corpus to item 1 of argv
	set startAt to ""
	if (count of argv) > 1 then set startAt to item 2 of argv
	set srcDir to corpus & "/generated"
	set outDir to corpus & "/docx"
	set pdfDir to corpus & "/reference/word-mac"
	set logFile to corpus & "/baseline-log.tsv"
	do shell script "mkdir -p " & quoted form of outDir & " " & quoted form of pdfDir
	-- Files that are tested as generated, without a Word copy, are left out.
	set names to paragraphs of (do shell script "cd " & quoted form of srcDir & " && ls | grep -E '^[A-Z]{2}-.*[.]docx$' | grep -v -E '^(ST-BAD|DX-PKG-01)' || true")
	set started to (startAt is "")
	repeat with n in names
		set n to n as text
		if not started and n is startAt then set started to true
		if started then
			set base to text 1 thru -6 of n
			set srcFile to POSIX file (srcDir & "/" & n)
			set docxPath to (POSIX file (outDir & "/" & n)) as text
			set pdfPath to (POSIX file (pdfDir & "/" & base & ".pdf")) as text
			try
				tell application "Microsoft Word"
					open srcFile
					set d to active document
					save as d file name docxPath file format format document
					save as active document file name pdfPath file format format PDF
					close active document saving no
				end tell
				do shell script "printf '%s\\tsaved\\n' " & quoted form of n & " >> " & quoted form of logFile
			on error msg
				do shell script "printf '%s\\terror\\t%s\\n' " & quoted form of n & " " & quoted form of msg & " >> " & quoted form of logFile
				tell application "Microsoft Word"
					try
						close active document saving no
					end try
				end tell
			end try
		end if
	end repeat
end run
