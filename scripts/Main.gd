extends Node2D

# RHYTHM BATTLE DEMO
# 画像や音を使わず、Godot の描画命令と UI ノードだけで作る1画面デモです。
# 初心者向けメモ: _ready は開始時、_process は毎フレーム、_draw は画面を描く時に呼ばれます。

const PLAYER_MAX_HP := 120
const ENEMY_MAX_HP := 180
const BEAT_SECONDS := 0.72

var player_hp := PLAYER_MAX_HP
var enemy_hp := ENEMY_MAX_HP
var beat_time := 0.0
var burst_flash := 0.0
var player_pop := 0.0
var enemy_pop := 0.0
var is_victory := false

var title_label: Label
var message_label: Label
var player_hp_bar: ProgressBar
var enemy_hp_bar: ProgressBar
var player_hp_label: Label
var enemy_hp_label: Label
var damage_layer: Control
var buttons: Array[Button] = []

func _ready() -> void:
	# ウィンドウタイトルもデモ名にします。
	DisplayServer.window_set_title("RHYTHM BATTLE DEMO")
	_create_ui()
	_update_hud("Space: ダウンビート攻撃 / R: グルーヴバースト / H: 脱力リカバー")
	queue_redraw()

func _process(delta: float) -> void:
	beat_time = fmod(beat_time + delta, BEAT_SECONDS)
	burst_flash = maxf(0.0, burst_flash - delta)
	player_pop = maxf(0.0, player_pop - delta)
	enemy_pop = maxf(0.0, enemy_pop - delta)
	queue_redraw()

func _unhandled_input(event: InputEvent) -> void:
	# InputMap を設定しなくても動くよう、キーコードを直接見ています。
	if event is InputEventKey and event.pressed and not event.echo:
		if event.keycode == KEY_SPACE:
			_downbeat_attack()
		elif event.keycode == KEY_R:
			_groove_burst()
		elif event.keycode == KEY_H:
			_relax_recover()
		elif event.keycode == KEY_ESCAPE:
			_reset_battle()

func _draw() -> void:
	var size := get_viewport_rect().size
	_draw_club_background(size)
	_draw_neon_grid(size)
	_draw_beat_ring(size)
	_draw_characters(size)
	_draw_command_frame(size)

func _create_ui() -> void:
	var canvas := CanvasLayer.new()
	add_child(canvas)

	title_label = Label.new()
	title_label.text = "RHYTHM BATTLE DEMO"
	title_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	title_label.add_theme_font_size_override("font_size", 34)
	title_label.add_theme_color_override("font_color", Color(0.2, 1.0, 1.0))
	title_label.set_anchors_preset(Control.PRESET_TOP_WIDE)
	title_label.offset_top = 18
	title_label.offset_bottom = 64
	canvas.add_child(title_label)

	player_hp_bar = _make_bar(Color(0.0, 0.95, 0.75))
	player_hp_bar.position = Vector2(70, 72)
	canvas.add_child(player_hp_bar)
	player_hp_label = _make_small_label(Vector2(70, 48), "HERO HP")
	canvas.add_child(player_hp_label)

	enemy_hp_bar = _make_bar(Color(1.0, 0.15, 0.85))
	enemy_hp_bar.position = Vector2(870, 72)
	canvas.add_child(enemy_hp_bar)
	enemy_hp_label = _make_small_label(Vector2(870, 48), "NOISE SHADOW HP")
	canvas.add_child(enemy_hp_label)

	message_label = Label.new()
	message_label.position = Vector2(82, 574)
	message_label.size = Vector2(650, 82)
	message_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	message_label.add_theme_font_size_override("font_size", 22)
	message_label.add_theme_color_override("font_color", Color.WHITE)
	canvas.add_child(message_label)

	damage_layer = Control.new()
	damage_layer.mouse_filter = Control.MOUSE_FILTER_IGNORE
	damage_layer.set_anchors_preset(Control.PRESET_FULL_RECT)
	canvas.add_child(damage_layer)

	_make_button(canvas, "Space 攻撃", Vector2(780, 575), Callable(self, "_downbeat_attack"))
	_make_button(canvas, "R バースト", Vector2(940, 575), Callable(self, "_groove_burst"))
	_make_button(canvas, "H リカバー", Vector2(1100, 575), Callable(self, "_relax_recover"))
	_make_button(canvas, "Esc リセット", Vector2(940, 642), Callable(self, "_reset_battle"))

func _make_bar(fill_color: Color) -> ProgressBar:
	var bar := ProgressBar.new()
	bar.size = Vector2(340, 26)
	bar.min_value = 0
	bar.max_value = 100
	bar.show_percentage = false
	bar.add_theme_stylebox_override("background", _style(Color(0.03, 0.04, 0.09, 0.92), Color(0.25, 0.9, 1.0), 2))
	bar.add_theme_stylebox_override("fill", _style(fill_color, fill_color, 0))
	return bar

func _make_small_label(pos: Vector2, text_value: String) -> Label:
	var label := Label.new()
	label.position = pos
	label.text = text_value
	label.add_theme_font_size_override("font_size", 18)
	label.add_theme_color_override("font_color", Color(0.85, 0.95, 1.0))
	return label

func _make_button(parent: Node, text_value: String, pos: Vector2, action: Callable) -> void:
	var button := Button.new()
	button.text = text_value
	button.position = pos
	button.size = Vector2(140, 48)
	button.pressed.connect(action)
	button.add_theme_font_size_override("font_size", 18)
	button.add_theme_stylebox_override("normal", _style(Color(0.05, 0.06, 0.16, 0.95), Color(0.0, 0.9, 1.0), 2))
	button.add_theme_stylebox_override("hover", _style(Color(0.14, 0.08, 0.28, 0.98), Color(1.0, 0.2, 0.9), 2))
	parent.add_child(button)
	buttons.append(button)

func _style(bg: Color, border: Color, border_width: int) -> StyleBoxFlat:
	var style := StyleBoxFlat.new()
	style.bg_color = bg
	style.border_color = border
	style.set_border_width_all(border_width)
	style.corner_radius_top_left = 8
	style.corner_radius_top_right = 8
	style.corner_radius_bottom_left = 8
	style.corner_radius_bottom_right = 8
	return style

func _draw_club_background(size: Vector2) -> void:
	draw_rect(Rect2(Vector2.ZERO, size), Color(0.015, 0.01, 0.04))
	for i in 9:
		var x := size.x * float(i) / 8.0
		var col := Color(0.08, 0.18, 0.34, 0.22 + 0.08 * sin(beat_time * 9.0 + i))
		draw_line(Vector2(x, 120), Vector2(size.x * 0.5, 390), col, 2.0)
	# ステージ照明
	draw_circle(Vector2(size.x * 0.5, 245), 215 + burst_flash * 80.0, Color(0.3, 0.05, 0.7, 0.12 + burst_flash * 0.18))
	draw_circle(Vector2(size.x * 0.5, 245), 115 + burst_flash * 120.0, Color(0.0, 0.8, 1.0, 0.08 + burst_flash * 0.22))

func _draw_neon_grid(size: Vector2) -> void:
	var horizon_y := 395.0
	var floor_bottom := size.y - 145.0
	draw_polygon([Vector2(0, floor_bottom), Vector2(size.x, floor_bottom), Vector2(size.x * 0.68, horizon_y), Vector2(size.x * 0.32, horizon_y)], [Color(0.02, 0.02, 0.08, 0.9)])
	for i in 17:
		var t := float(i) / 16.0
		var x_bottom := lerpf(-120.0, size.x + 120.0, t)
		var x_top := lerpf(size.x * 0.42, size.x * 0.58, t)
		draw_line(Vector2(x_bottom, floor_bottom), Vector2(x_top, horizon_y), Color(0.0, 0.85, 1.0, 0.42), 1.4)
	for j in 9:
		var t2 := float(j) / 8.0
		var y := lerpf(horizon_y, floor_bottom, t2 * t2)
		var half := lerpf(size.x * 0.18, size.x * 0.62, t2)
		draw_line(Vector2(size.x * 0.5 - half, y), Vector2(size.x * 0.5 + half, y), Color(1.0, 0.0, 0.85, 0.45), 1.6)

func _draw_beat_ring(size: Vector2) -> void:
	var center := Vector2(size.x * 0.5, 305)
	var beat_ratio := beat_time / BEAT_SECONDS
	var pulse := 1.0 - beat_ratio
	draw_arc(center, 66 + 70 * pulse, 0, TAU, 96, Color(0.0, 1.0, 1.0, 0.18 + pulse * 0.5), 5.0)
	draw_arc(center, 42 + 18 * sin(beat_ratio * TAU), 0, TAU, 96, Color(1.0, 0.1, 0.95, 0.7), 4.0)
	if burst_flash > 0.0:
		draw_arc(center, 115 + burst_flash * 230.0, 0, TAU, 128, Color(1.0, 1.0, 0.25, burst_flash), 8.0)
	draw_string(ThemeDB.fallback_font, center + Vector2(-42, 8), "BEAT", HORIZONTAL_ALIGNMENT_LEFT, -1, 24, Color(0.9, 1.0, 1.0))

func _draw_characters(size: Vector2) -> void:
	var hero := Vector2(285, 382 - player_pop * 28.0)
	var enemy := Vector2(size.x - 285, 370 - enemy_pop * 22.0)
	# 主人公: ダンスしながら戦うオリジナルキャラクターのシルエット
	draw_circle(hero + Vector2(0, -82), 30, Color(0.0, 0.95, 0.85))
	draw_line(hero + Vector2(0, -50), hero + Vector2(-18, 35), Color(0.0, 0.95, 0.85), 16)
	draw_line(hero + Vector2(-8, -20), hero + Vector2(-78, -62 + 10 * sin(beat_time * 12.0)), Color(0.2, 1.0, 1.0), 10)
	draw_line(hero + Vector2(-4, 10), hero + Vector2(58, -18), Color(0.2, 1.0, 1.0), 10)
	draw_line(hero + Vector2(-18, 35), hero + Vector2(-62, 103), Color(0.0, 0.95, 0.85), 12)
	draw_line(hero + Vector2(-18, 35), hero + Vector2(35, 103), Color(0.0, 0.95, 0.85), 12)
	draw_string(ThemeDB.fallback_font, hero + Vector2(-72, 138), "GROOVE HERO", HORIZONTAL_ALIGNMENT_LEFT, -1, 20, Color(0.75, 1.0, 1.0))
	# 敵: ノイズシャドウ。既存作品に似せない抽象的な音の影です。
	draw_circle(enemy + Vector2(0, -65), 48, Color(0.08, 0.03, 0.13))
	draw_arc(enemy + Vector2(0, -65), 58 + 8 * sin(beat_time * 14.0), 0, TAU, 64, Color(1.0, 0.05, 0.75, 0.8), 5)
	draw_polygon([enemy + Vector2(-56, -25), enemy + Vector2(56, -25), enemy + Vector2(35, 105), enemy + Vector2(-42, 105)], [Color(0.05, 0.02, 0.09)])
	draw_line(enemy + Vector2(-22, -72), enemy + Vector2(-5, -62), Color(1.0, 0.1, 0.9), 5)
	draw_line(enemy + Vector2(22, -72), enemy + Vector2(5, -62), Color(1.0, 0.1, 0.9), 5)
	draw_string(ThemeDB.fallback_font, enemy + Vector2(-88, 138), "NOISE SHADOW", HORIZONTAL_ALIGNMENT_LEFT, -1, 20, Color(1.0, 0.65, 0.95))

func _draw_command_frame(size: Vector2) -> void:
	draw_rect(Rect2(54, 548, size.x - 108, 146), Color(0.015, 0.02, 0.08, 0.86))
	draw_rect(Rect2(54, 548, size.x - 108, 146), Color(0.0, 0.9, 1.0, 0.55), false, 3.0)
	draw_line(Vector2(740, 548), Vector2(740, 694), Color(1.0, 0.0, 0.85, 0.42), 2.0)

func _downbeat_attack() -> void:
	if is_victory:
		return
	var timing := beat_time / BEAT_SECONDS
	var near_downbeat := timing < 0.18 or timing > 0.82
	var damage := 18 if near_downbeat else 9
	_apply_enemy_damage(damage, "ダウンビート命中！" if near_downbeat else "少しズレたが攻撃！")

func _groove_burst() -> void:
	if is_victory:
		return
	burst_flash = 1.0
	_apply_enemy_damage(34, "グルーヴバースト！ ビートリングが爆発した！")

func _relax_recover() -> void:
	if is_victory:
		return
	var heal := 22
	player_hp = mini(PLAYER_MAX_HP, player_hp + heal)
	player_pop = 0.35
	_spawn_float_text(Vector2(260, 250), "+%d" % heal, Color(0.3, 1.0, 0.55))
	_update_hud("脱力リカバー。肩の力を抜いてHP回復！")

func _apply_enemy_damage(amount: int, text_value: String) -> void:
	enemy_hp = maxi(0, enemy_hp - amount)
	enemy_pop = 0.35
	_spawn_float_text(Vector2(940, 250), "-%d" % amount, Color(1.0, 0.85, 0.1))
	if enemy_hp <= 0:
		is_victory = true
		_update_hud("勝利！ ノイズシャドウはリズムに溶けた！ Escで再戦できます。")
	else:
		# デモが動いて見えるように、敵も小さく反撃します。
		player_hp = maxi(0, player_hp - 6)
		_spawn_float_text(Vector2(300, 250), "-6", Color(1.0, 0.25, 0.45))
		_update_hud(text_value + " 反動ノイズでHPが少し減った。")

func _reset_battle() -> void:
	player_hp = PLAYER_MAX_HP
	enemy_hp = ENEMY_MAX_HP
	beat_time = 0.0
	burst_flash = 0.0
	player_pop = 0.0
	enemy_pop = 0.0
	is_victory = false
	for child in damage_layer.get_children():
		child.queue_free()
	_update_hud("バトルをリセット。ビートに合わせてSpaceを押そう！")

func _update_hud(text_value: String) -> void:
	player_hp_bar.value = 100.0 * float(player_hp) / float(PLAYER_MAX_HP)
	enemy_hp_bar.value = 100.0 * float(enemy_hp) / float(ENEMY_MAX_HP)
	player_hp_label.text = "GROOVE HERO HP  %d / %d" % [player_hp, PLAYER_MAX_HP]
	enemy_hp_label.text = "NOISE SHADOW HP  %d / %d" % [enemy_hp, ENEMY_MAX_HP]
	message_label.text = text_value

func _spawn_float_text(pos: Vector2, text_value: String, color: Color) -> void:
	var label := Label.new()
	label.text = text_value
	label.position = pos
	label.add_theme_font_size_override("font_size", 34)
	label.add_theme_color_override("font_color", color)
	damage_layer.add_child(label)
	var tween := create_tween()
	tween.tween_property(label, "position", pos + Vector2(0, -70), 0.75).set_trans(Tween.TRANS_CUBIC).set_ease(Tween.EASE_OUT)
	tween.parallel().tween_property(label, "modulate:a", 0.0, 0.75)
	tween.tween_callback(label.queue_free)
