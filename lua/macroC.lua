-- 最終段階、マイスター、飯のみ
count = 30

for i = 1, count do
    yield("/echo 残り" .. count - i + 1 .. "回")
    yield("/click synthesize <wait.2>")
    yield("/waitaddon Synthesis")
    -- 初期
    yield("/ac 確信 <wait.3>")
    yield("/ac マニピュレーション <wait.3>")
    -- 工数上げ
    long = HasCondition('高能率') or HasCondition('長持続')
    action = HasCondition("高能率") and "長期倹約" or "倹約"
    yield("/ac " .. action .. " <wait.3>")
    yield("/ac ヴェネレーション <wait.3>")
    action = HasCondition("高品質") and "集中作業" or "下地作業"
    yield("/ac " .. action .. " <wait.3>")
    action = HasCondition("高品質") and "集中作業" or "下地作業"
    yield("/ac " .. action .. " <wait.3>")
    -- 進捗: 3929 - 5558
    if (HasCondition('高進捗')) then
        if (GetProgress() + 1830 < 7040) then -- TODO: マイスターの値に修正
            yield("/ac 下地作業 <wait.3>")
        else
            yield("/ac 模範作業 <wait.3>")
        end
    elseif (HasCondition('高品質')) then
        yield("/ac 集中作業 <wait.3>")
    else
        yield("/ac 下地作業 <wait.3>")
    end
    -- 進捗: 5148 - 6914
    if (long or HasCondition('頑丈')) then
        if (HasCondition('高進捗')) then
            if (GetProgress() + 1830 < 7040) then -- TODO: マイスターの値に修正
                yield("/ac 下地作業 <wait.3>")
            elseif (GetProgress() + 915 < 7040) then -- TODO: マイスターの値に修正
                yield("/ac 模範作業 <wait.3>")
            end
        else
            if (GetProgress() + 1219 < 7040) then -- TODO: マイスターの値に修正
                yield("/ac 下地作業 <wait.3>")
            elseif (GetProgress() + 609 < 7040) then -- TODO: マイスターの値に修正
                yield("/ac 模範作業 <wait.3>")
            end
        end
    elseif (HasCondition('高品質')) then
        if (GetProgress() + 1356 < 7040) then -- TODO: マイスターの値に修正
            yield("/ac 集中作業 <wait.3>")
        elseif (GetProgress() + 609 < 7040) then -- TODO: マイスターの値に修正
            yield("/ac 模範作業 <wait.3>")
        end
    elseif (HasCondition('高進捗')) then
        if (GetProgress() + 915 < 7040) then -- TODO: マイスターの値に修正
            yield("/ac 倹約作業 <wait.3>")
        end
    else
        if (GetProgress() + 609 < 7040) then -- TODO: マイスターの値に修正
            yield("/ac 倹約作業 <wait.3>")
        end
    end
    -- 残進捗から完成に必要な必要なCPと耐久を計算する
    restProgress = 7040 - GetProgress()

    if (restProgress <= 406) then
      needCp = 7
      needDu = 1
      finishActions = {'模範作業'}
    elseif (restProgress <= 452) then
      needCp = 12
      needDu = 1
      finishActions = {'経過観察', '注視作業'}
    elseif (restProgress <= 812) then
      needCp = 25
      needDu = 6
      finishActions = {'倹約作業', '模範作業'}
    elseif (restProgress <= 858) then
      needCp = 30
      needDu = 6
      finishActions = {'倹約作業', '経過観察', '注視作業'}
    elseif (restProgress <= 1218) then
      needCp = 43
      needDu = 6
      finishActions = {'ヴェネレーション', '倹約作業', '模範作業'}
    elseif (restProgress <= 1287) then
      needCp = 48
      needDu = 6
      finishActions = {'ヴェネレーション', '倹約作業', '経過観察', '注視作業'}
    else
      -- '到達しないはず'
    end
    -- 仮: イノベ, 倹約, 倹約, グレスラ, ビエルゴ: CP124, 耐久20
    needDu = needDu + 20
    needCp = needCp + 124
    -- 品質上げフェーズ
end
