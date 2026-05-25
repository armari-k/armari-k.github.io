(function(){
  async function copyTextFromTextarea(textareaId, button){
    const textarea=document.getElementById(textareaId);
    if(!textarea||!button)return false;

    const original=button.textContent;
    let copied=false;

    try{
      if(navigator.clipboard){
        await navigator.clipboard.writeText(textarea.value);
        copied=true;
      }
    }catch(e){}

    if(!copied){
      textarea.select();
      copied=document.execCommand('copy');
    }

    button.textContent=copied?'Copied ✓':'Copy failed';
    setTimeout(()=>{button.textContent=original;},2000);
    return copied;
  }

  const dialogState=new WeakMap();

  function openDialog(overlay, dialog, trigger){
    if(!overlay||!dialog)return;
    dialogState.set(overlay,{trigger});
    overlay.classList.add('open');
    document.body.style.overflow='hidden';
    dialog.focus();
  }

  function closeDialog(overlay){
    if(!overlay)return;
    const state=dialogState.get(overlay)||{};
    overlay.classList.remove('open');
    document.body.style.overflow='';
    if(state.trigger&&typeof state.trigger.focus==='function')state.trigger.focus();
    dialogState.delete(overlay);
  }

  function shouldCloseDialog(event, overlay, closeClass){
    if(!event)return true;
    if(event.target===overlay)return true;
    return !!(closeClass&&event.target.classList&&event.target.classList.contains(closeClass));
  }

  function renderCategoryRows(categories, item, options){
    const settings=options||{};
    const contributionScale=settings.contributionScale||11000;
    const formatNumber=settings.formatNumber||function(n){return n.toLocaleString();};

    return categories.map(function(category){
      const score=item[category.key];
      const contribution=Math.round(score*category.w*contributionScale);
      return `<div class="cat-row" style="--cat-color:${category.col};--cat-score:${score}%">
      <div class="cat-label"><span class="cat-dot" aria-hidden="true"></span>${category.label}</div>
      <div class="cat-track"><div class="cat-fill"></div></div>
      <div class="cat-score">${score}/100</div>
      <div class="cat-contrib">+${formatNumber(contribution)}</div>
    </div>`;
    }).join('');
  }

  window.AAACommon={
    copyTextFromTextarea,
    openDialog,
    closeDialog,
    shouldCloseDialog,
    renderCategoryRows
  };
})();
