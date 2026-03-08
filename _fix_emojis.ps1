Set-Location 'C:\Users\Lucas\Desktop\forum_github_v6'
$utf8 = [System.Text.UTF8Encoding]::new($false)

# Emoji characters built from Unicode code points (avoids encoding issues in PS source)
$E_POLICE  = [char]::ConvertFromUtf32(0x1F694) # police car
$E_MEDICAL = [char]::ConvertFromUtf32(0x1F3E5) # hospital
$E_STAR    = [char]::ConvertFromUtf32(0x2B50)  # star
$E_CHAT    = [char]::ConvertFromUtf32(0x1F4AC) # speech balloon
$E_WAVE    = [char]::ConvertFromUtf32(0x1F44B) # wave hand
$E_UNLOCK  = [char]::ConvertFromUtf32(0x1F513) # unlock
$E_SIREN   = [char]::ConvertFromUtf32(0x1F6A8) # siren
$E_MEGA    = [char]::ConvertFromUtf32(0x1F4E2) # megaphone
$E_TRASH   = [char]::ConvertFromUtf32(0x1F5D1) # trash

# SVG icon definitions (single-quoted PS = no interpolation, double quotes inside are safe)
$SVG_POLICE  = '<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>'
$SVG_MEDICAL = '<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>'
$SVG_STAR    = '<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>'
$SVG_CHAT    = '<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>'
$SVG_PERSON  = '<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>'
$SVG_UNLOCK  = '<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M12 1C9.24 1 7 3.24 7 6v1H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2h-2V6c0-2.76-2.24-5-5-5zm0 2c1.66 0 3 1.34 3 3v1H9V6c0-1.66 1.34-3 3-3zm0 9c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"/></svg>'
$SVG_LOCK    = '<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>'
$SVG_ALERT   = '<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M12 2C9.79 2 8 3.79 8 6v7H6l-2 3v1h16v-1l-2-3h-2V6c0-2.21-1.79-4-4-4zM12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2z"/></svg>'
$SVG_WARN    = '<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>'
$SVG_MEGA    = '<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M18 3a1 1 0 0 0-1.447-.894L8.763 6H5a3 3 0 0 0 0 6h.28l1.772 5.316A1 1 0 0 0 8 18h2a1 1 0 0 0 .95-1.316L9.28 12h-.52l8.293 3.894A1 1 0 0 0 18 15V3z"/></svg>'
$SVG_PEN     = '<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>'
$SVG_SHOP    = '<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M16 6v-2c0-2.2-1.8-4-4-4S8 1.8 8 4v2H2v16h20V6h-6zm-4-4c1.1 0 2 .9 2 2v2h-4V4c0-1.1.9-2 2-2zm6 18H6V8h12v12z"/></svg>'
$SVG_CLIP    = '<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>'

# Large versions (48px for cards)
$SVG_POLICE_L  = '<svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>'
$SVG_MEDICAL_L = '<svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>'
$SVG_STAR_L    = '<svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>'
$SVG_SHOP_L    = '<svg viewBox="0 0 24 24" fill="currentColor" width="60" height="60"><path d="M16 6v-2c0-2.2-1.8-4-4-4S8 1.8 8 4v2H2v16h20V6h-6zm-4-4c1.1 0 2 .9 2 2v2h-4V4c0-1.1.9-2 2-2zm6 18H6V8h12v12z"/></svg>'
$SVG_DISCORD   = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#5865f2" width="36" height="36"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.033.054a19.897 19.897 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>'

$INLINE_STYLE = ' style="vertical-align:middle;margin-right:4px"'

# Inline SVG wrappers for page titles (26px)
$TITLE_POLICE  = '<svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26"' + $INLINE_STYLE + '><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>'
$TITLE_MEDICAL = '<svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26"' + $INLINE_STYLE + '><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>'
$TITLE_STAR    = '<svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26"' + $INLINE_STYLE + '><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>'
$TITLE_CLIP    = '<svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26"' + $INLINE_STYLE + '><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>'
$TITLE_CHAT    = '<svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26"' + $INLINE_STYLE + '><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>'
$TITLE_PERSON  = '<svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26"' + $INLINE_STYLE + '><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>'
$TITLE_UNLOCK  = '<svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26"' + $INLINE_STYLE + '><path d="M12 1C9.24 1 7 3.24 7 6v1H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2h-2V6c0-2.76-2.24-5-5-5zm0 2c1.66 0 3 1.34 3 3v1H9V6c0-1.66 1.34-3 3-3zm0 9c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"/></svg>'
$TITLE_ALERT   = '<svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26"' + $INLINE_STYLE + '><path d="M12 2C9.79 2 8 3.79 8 6v7H6l-2 3v1h16v-1l-2-3h-2V6c0-2.21-1.79-4-4-4zM12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2z"/></svg>'
$TITLE_MEGA    = '<svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26"' + $INLINE_STYLE + '><path d="M18 3a1 1 0 0 0-1.447-.894L8.763 6H5a3 3 0 0 0 0 6h.28l1.772 5.316A1 1 0 0 0 8 18h2a1 1 0 0 0 .95-1.316L9.28 12h-.52l8.293 3.894A1 1 0 0 0 18 15V3z"/></svg>'
$TITLE_PEN     = '<svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26"' + $INLINE_STYLE + '><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>'
$TITLE_SHOP    = '<svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26"' + $INLINE_STYLE + '><path d="M16 6v-2c0-2.2-1.8-4-4-4S8 1.8 8 4v2H2v16h20V6h-6zm-4-4c1.1 0 2 .9 2 2v2h-4V4c0-1.1.9-2 2-2zm6 18H6V8h12v12z"/></svg>'

function Patch([string]$file) {
  $p = Join-Path (Get-Location) $file
  if (-not (Test-Path $p)) { Write-Host "SKIP: $file"; return }
  $c = [IO.File]::ReadAllText($p, $utf8)
  $orig = $c

  # Discord widget
  $c = $c.Replace('<div style="font-size:28px;margin-bottom:8px">&#127918;</div>',
                  '<div style="margin-bottom:8px">' + $SVG_DISCORD + '</div>')

  # Ann-icon emojis (by HTML entity)
  $c = $c.Replace('<div class="ann-icon">&#128221;</div>', '<div class="ann-icon">' + $SVG_CLIP + '</div>')
  $c = $c.Replace('<div class="ann-icon">&#128274;</div>', '<div class="ann-icon">' + $SVG_LOCK + '</div>')
  $c = $c.Replace('<div class="ann-icon">&#9888;&#65039;</div>', '<div class="ann-icon">' + $SVG_WARN + '</div>')
  $c = $c.Replace('<div class="ann-icon">&#128680;</div>', '<div class="ann-icon">' + $SVG_ALERT + '</div>')
  $c = $c.Replace('<div class="ann-icon">&#128717;</div>', '<div class="ann-icon">' + $SVG_SHOP + '</div>')

  # Page-title emojis (replace entity + space before <span> or standalone)
  $c = $c.Replace('&#128659; <span>', $TITLE_POLICE + '<span>')
  $c = $c.Replace('&#127973; <span>', $TITLE_MEDICAL + '<span>')
  $c = $c.Replace('&#11088; <span>', $TITLE_STAR + '<span>')
  $c = $c.Replace('&#128203; <span>', $TITLE_CLIP + '<span>')
  $c = $c.Replace('&#128172; Discussions ', $TITLE_CHAT + 'Discussions ')
  $c = $c.Replace('&#128075; <span>', $TITLE_PERSON + '<span>')
  $c = $c.Replace('&#128275; Demandes ', $TITLE_UNLOCK + 'Demandes ')
  $c = $c.Replace('&#128680; Signalements ', $TITLE_ALERT + 'Signalements ')
  $c = $c.Replace('&#128227; Annonces ', $TITLE_MEGA + 'Annonces ')
  $c = $c.Replace('&#9997;&#65039; Nouveau ', $TITLE_PEN + 'Nouveau ')
  $c = $c.Replace('&#9997;&#65039; Nouvelle ', $TITLE_PEN + 'Nouvelle ')
  $c = $c.Replace('&#128717; <span>', $TITLE_SHOP + '<span>')

  # Boutique large center icon
  $c = $c.Replace('<div style="font-size:60px;margin-bottom:16px">&#128717;</div>',
                  '<div style="margin-bottom:16px">' + $SVG_SHOP_L + '</div>')

  # Candidatures large card icons
  $c = $c.Replace('<div style="font-size:40px;margin-bottom:12px">&#128659;</div>',
                  '<div style="margin-bottom:12px">' + $SVG_POLICE_L + '</div>')
  $c = $c.Replace('<div style="font-size:40px;margin-bottom:12px">&#127973;</div>',
                  '<div style="margin-bottom:12px">' + $SVG_MEDICAL_L + '</div>')
  $c = $c.Replace('<div style="font-size:40px;margin-bottom:12px">&#11088;</div>',
                  '<div style="margin-bottom:12px">' + $SVG_STAR_L + '</div>')

  # JS renderTopics icon: 'emoji', -- using char codes to avoid encoding issues
  $c = $c.Replace("icon: '" + $E_POLICE + "',",  "icon: '" + $SVG_POLICE + "',")
  $c = $c.Replace("icon: '" + $E_MEDICAL + "',", "icon: '" + $SVG_MEDICAL + "',")
  $c = $c.Replace("icon: '" + $E_STAR + "',",    "icon: '" + $SVG_STAR + "',")
  $c = $c.Replace("icon: '" + $E_CHAT + "',",    "icon: '" + $SVG_CHAT + "',")
  $c = $c.Replace("icon: '" + $E_WAVE + "',",    "icon: '" + $SVG_PERSON + "',")
  $c = $c.Replace("icon: '" + $E_UNLOCK + "',",  "icon: '" + $SVG_UNLOCK + "',")
  $c = $c.Replace("icon: '" + $E_SIREN + "',",   "icon: '" + $SVG_ALERT + "',")
  $c = $c.Replace("icon: '" + $E_MEGA + "',",    "icon: '" + $SVG_MEGA + "',")

  # Delete button trash emoji in sujet.html
  $c = $c.Replace($E_TRASH + ' Sup.', 'Sup.')
  $c = $c.Replace($E_TRASH + ' Topic', 'Topic')

  if ($c -ne $orig) {
    [IO.File]::WriteAllText($p, $c, $utf8)
    Write-Host "PATCHED: $file"
  } else {
    Write-Host "no changes: $file"
  }
}

# Apply to all HTML files
Get-ChildItem '*.html' | ForEach-Object { Patch $_.Name }

# Fix nrp-forum.js: default icon and trash button
$jsPath = 'nrp-forum.js'
$c = [IO.File]::ReadAllText($jsPath, $utf8)
$orig = $c
$c = $c.Replace("opt.icon||'" + $E_CHAT + "'", "opt.icon||'" + $SVG_CHAT + "'")
$c = $c.Replace(">" + $E_TRASH + "</button>", ">&#10005;</button>")
if ($c -ne $orig) {
  [IO.File]::WriteAllText($jsPath, $c, $utf8)
  Write-Host "PATCHED: $jsPath"
} else {
  Write-Host "no changes: $jsPath"
}

Write-Host "`nDone!"
